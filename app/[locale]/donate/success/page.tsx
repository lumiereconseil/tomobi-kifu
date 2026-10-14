import Link from "next/link";
import { notFound } from "next/navigation";
import { formatMoney, type Currency } from "@/lib/donation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { getRecipient } from "@/lib/recipients";
import { getStripe } from "@/lib/stripe";

export default async function Success({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string; r?: string; demo?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const { session_id, r, demo } = await searchParams;
  const recipient = r ? getRecipient(r) : undefined;

  let paid: string | null = null;
  const stripe = getStripe();
  if (stripe && session_id) {
    try {
      const s = await stripe.checkout.sessions.retrieve(session_id);
      if (s.amount_total != null && s.currency) {
        const c = s.currency as Currency;
        paid = formatMoney(c === "jpy" ? s.amount_total : s.amount_total / 100, c, locale);
      }
    } catch {
      // Ignore lookup failures; the thank-you message still applies.
    }
  }

  return (
    <div className="container section center">
      <div className="big-emoji" aria-hidden>
        🎉
      </div>
      <h1>{t.thanksTitle}</h1>
      {recipient && (
        <p className="lead">
          {recipient.name[locale]}
          {paid && ` · ${paid}`}
        </p>
      )}
      <p>{t.thanksBody}</p>
      {demo && <p className="notice">{t.demoNote}</p>}
      <Link href={`/${locale}`} className="btn btn-primary">
        {t.backHome}
      </Link>
    </div>
  );
}
