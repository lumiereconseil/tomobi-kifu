import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStore, toJpy } from "@/lib/db";
import { getRecipient } from "@/lib/recipients";
import { getStripe } from "@/lib/stripe";

function fromStripeAmount(amount: number, currency: string): number {
  return currency === "jpy" ? amount : amount / 100;
}

async function record(
  stripeId: string,
  amountMinor: number | null,
  currency: string | null,
  metadata: Stripe.Metadata | null | undefined,
  monthly: boolean,
  donorName: string | null,
) {
  const slug = metadata?.recipient;
  if (!slug || !getRecipient(slug) || amountMinor == null || !currency) return;
  // Split the charge into what the recipient receives and the platform fee (set at checkout).
  const toRecipientMinor = Number(metadata.to_recipient_minor);
  const feeMinor = Number(metadata.fee_minor);
  const hasSplit = Number.isFinite(toRecipientMinor) && toRecipientMinor > 0 && Number.isFinite(feeMinor);
  const amount = fromStripeAmount(hasSplit ? toRecipientMinor : amountMinor, currency);
  const fee = hasSplit ? fromStripeAmount(feeMinor, currency) : 0;
  await getStore().recordDonation({
    stripeId,
    recipientSlug: slug,
    amount,
    currency,
    amountJpy: toJpy(amount, currency),
    feeJpy: toJpy(fee, currency),
    monthly,
    anonymous: metadata.anonymous === "true",
    donorName,
    message: metadata.message || null,
  });
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "webhook_not_configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "missing_signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, secret);
  } catch (err) {
    console.error("webhook signature verification failed", err);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        // Covers one-time gifts and the first payment of a monthly gift.
        const s = event.data.object;
        if (s.payment_status !== "paid") break;
        await record(
          s.id,
          s.amount_total,
          s.currency,
          s.metadata,
          s.mode === "subscription",
          s.customer_details?.name ?? null,
        );
        break;
      }
      case "invoice.paid": {
        // Renewals of monthly gifts; the first invoice is already counted above.
        const inv = event.data.object;
        if (inv.billing_reason !== "subscription_cycle") break;
        await record(
          inv.id ?? `invoice_${event.id}`,
          inv.amount_paid,
          inv.currency,
          inv.parent?.subscription_details?.metadata,
          true,
          inv.customer_name ?? null,
        );
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("failed to record donation", err);
    // Non-2xx makes Stripe retry; recordDonation is idempotent on stripe id.
    return NextResponse.json({ error: "storage_error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
