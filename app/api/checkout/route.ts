import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStore, toJpy } from "@/lib/db";
import {
  currencies,
  feeBreakdown,
  limits,
  platformFeePercent,
  toStripeAmount,
  type Currency,
} from "@/lib/donation";
import { isLocale } from "@/lib/i18n";
import { getRecipient } from "@/lib/recipients";
import { getStripe, siteUrl } from "@/lib/stripe";

type Body = {
  slug?: string;
  amount?: number;
  currency?: string;
  frequency?: string;
  message?: string;
  anonymous?: boolean;
  locale?: string;
  /** Donor pays the platform fee on top so the recipient receives the full amount. */
  coverFee?: boolean;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const recipient = body.slug ? getRecipient(body.slug) : undefined;
  if (!recipient) return NextResponse.json({ error: "unknown_recipient" }, { status: 404 });
  if (recipient.payment.mode !== "direct") {
    // Local governments, relief funds and overseas recipients take gifts on their own pages.
    return NextResponse.json({ error: "external_recipient" }, { status: 400 });
  }

  const currency = body.currency as Currency;
  if (!currencies.includes(currency)) {
    return NextResponse.json({ error: "invalid_currency" }, { status: 400 });
  }

  const amount = Number(body.amount);
  const { min, max } = limits[currency];
  if (!Number.isFinite(amount) || amount < min || amount > max) {
    return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
  }

  if (!recipient.stripeAccountId && process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_")) {
    // In live mode, never collect into the operator's own account.
    return NextResponse.json({ error: "recipient_not_onboarded" }, { status: 409 });
  }

  const feePercent = platformFeePercent(recipient.feePercent);
  const coverFee = Boolean(body.coverFee);
  const { total, fee, toRecipient } = feeBreakdown(toStripeAmount(amount, currency), feePercent, coverFee);
  const fromMinor = (n: number) => (currency === "jpy" ? n : n / 100);

  const locale = body.locale && isLocale(body.locale) ? body.locale : "ja";
  const monthly = body.frequency === "monthly";
  const base = siteUrl();
  const successUrl = `${base}/${locale}/donate/success?session_id={CHECKOUT_SESSION_ID}&r=${recipient.slug}`;
  const cancelUrl = `${base}/${locale}/donate/cancel?r=${recipient.slug}`;

  const stripe = getStripe();
  if (!stripe) {
    // Demo mode: no Stripe key configured, so skip payment and record the gift directly
    // so totals and the supporter list can be tried out. Never write demo gifts to a real
    // database.
    if (!process.env.DATABASE_URL) {
      await getStore().recordDonation({
        stripeId: `demo_${crypto.randomUUID()}`,
        recipientSlug: recipient.slug,
        amount: fromMinor(toRecipient),
        currency,
        amountJpy: toJpy(fromMinor(toRecipient), currency),
        feeJpy: toJpy(fromMinor(fee), currency),
        monthly,
        anonymous: Boolean(body.anonymous),
        donorName: null,
        message: (body.message ?? "").slice(0, 450) || null,
      });
    }
    return NextResponse.json({ url: `/${locale}/donate/success?demo=1&r=${recipient.slug}` });
  }

  const metadata: Stripe.MetadataParam = {
    recipient: recipient.slug,
    anonymous: body.anonymous ? "true" : "false",
    message: (body.message ?? "").slice(0, 450),
    // Stripe minor units: what the recipient receives and the platform fee.
    to_recipient_minor: String(toRecipient),
    fee_minor: String(fee),
  };
  const productName = `${locale === "ja" ? "寄付" : "Donation"}: ${recipient.name[locale]}`;

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: monthly ? "subscription" : "payment",
    locale: locale === "ja" ? "ja" : "en",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency,
          unit_amount: total,
          product_data: {
            name: productName,
            description:
              locale === "ja"
                ? `うち事務手数料 ${feePercent}%（Lumière Conseil）${coverFee ? "を寄付者が負担" : ""}`
                : `Includes a ${feePercent}% administrative fee (Lumière Conseil)${coverFee ? " covered by you" : ""}`,
          },
          ...(monthly ? { recurring: { interval: "month" as const } } : {}),
        },
      },
    ],
    metadata,
    success_url: successUrl,
    cancel_url: cancelUrl,
  };

  // With Stripe Connect the money goes straight to the recipient's own account, so the
  // operator never holds donated funds; the operator keeps only the application fee.
  const destination = recipient.stripeAccountId;
  if (monthly) {
    params.subscription_data = {
      metadata,
      ...(destination
        ? {
            transfer_data: { destination },
            ...(fee > 0 ? { application_fee_percent: Math.round((fee / total) * 10000) / 100 } : {}),
          }
        : {}),
    };
  } else {
    params.submit_type = "donate";
    params.payment_intent_data = {
      metadata,
      ...(destination
        ? { transfer_data: { destination }, ...(fee > 0 ? { application_fee_amount: fee } : {}) }
        : {}),
    };
  }

  try {
    const session = await stripe.checkout.sessions.create(params);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("stripe checkout error", err);
    return NextResponse.json({ error: "stripe_error" }, { status: 502 });
  }
}
