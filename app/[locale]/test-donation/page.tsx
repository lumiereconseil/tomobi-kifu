import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DonateLinks } from "@/components/DonateLinks";
import { isLocale, locales } from "@/lib/i18n";
import { paymentLinksFor } from "@/lib/payment-links";

// Unlisted page with test-mode buttons, to check the donation flow end to end with
// Stripe's test card. It is not linked from the site and is hidden from search engines.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = { robots: { index: false } };

export default async function TestDonation({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const links = paymentLinksFor("test-donation");
  if (!links?.test) notFound();
  return (
    <div className="container section">
      <h1>{locale === "ja" ? "寄付の動作確認（テスト）" : "Donation test"}</h1>
      <p className="muted">
        {locale === "ja"
          ? "カード番号 4242 4242 4242 4242、有効期限は未来の日付、セキュリティコードは任意の3桁で試せます。お金は動きません。"
          : "Use card 4242 4242 4242 4242, any future expiry date and any 3-digit CVC. No money moves."}
      </p>
      <aside className="panel">
        <DonateLinks links={links} locale={locale} feePercent={10} />
      </aside>
    </div>
  );
}
