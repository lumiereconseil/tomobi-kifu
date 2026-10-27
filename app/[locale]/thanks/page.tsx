import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales } from "@/lib/i18n";

// Where Stripe Payment Links send donors after paying. Static, so it works on GitHub Pages.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = { robots: { index: false } };

export default async function Thanks({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <div className="container section center">
      <div className="big-emoji" aria-hidden>
        🎉
      </div>
      <h1>{t.thanksTitle}</h1>
      <p>{t.thanksBody}</p>
      <Link href={`/${locale}`} className="btn btn-primary">
        {t.backHome}
      </Link>
    </div>
  );
}
