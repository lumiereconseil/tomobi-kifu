import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/stripe";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: t.siteName, template: `%s | ${t.siteName}` },
    description: t.tagline,
    alternates: {
      languages: { ...Object.fromEntries(locales.map((l) => [l, `/${l}`])), "x-default": "/ja" },
    },
    openGraph: {
      type: "website",
      siteName: t.siteName,
      locale: locale === "ja" ? "ja_JP" : "en_US",
      alternateLocale: locale === "ja" ? ["en_US"] : ["ja_JP"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <html lang={locale}>
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <Link href={`/${locale}`} className="logo">
              <span aria-hidden>♡</span> {t.siteName}
              <small className="logo-sub">by Lumière Conseil</small>
            </Link>
            <nav className="nav">
              <Link href={`/${locale}#recipients`}>{t.browse}</Link>
              <Link href={`/${locale}/how-it-works`}>{t.howItWorks}</Link>
              <LocaleSwitcher locale={locale} />
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container footer-inner">
            <p>
              © {new Date().getFullYear()} Lumière Conseil · {t.footer}
            </p>
            <nav className="nav">
              <Link href={`/${locale}/how-it-works`}>{t.howItWorks}</Link>
              <Link href={`/${locale}/apply`}>{t.apply}</Link>
              <Link href={`/${locale}/legal`}>{t.legal}</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
