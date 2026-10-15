import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionPage } from "@/components/CollectionPage";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { getTheme, themeRecipients, themes } from "@/lib/themes";

export function generateStaticParams() {
  return locales.flatMap((locale) => themes.map((t) => ({ locale, slug: t.slug })));
}

type Params = Promise<{ locale: string; slug: string }>;

const titleFor = (name: string, locale: Locale) => (locale === "ja" ? `${name}の寄付先` : `${name}: where to donate`);

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = getTheme(slug);
  if (!t || !isLocale(locale)) return {};
  return pageMetadata(locale, `/causes/${slug}`, { title: titleFor(t.name[locale], locale), description: t.summary[locale] });
}

export default async function CausePage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const t = getTheme(slug);
  if (!t) notFound();
  const ja = locale === "ja";
  return (
    <CollectionPage
      locale={locale}
      path={`/causes/${slug}`}
      crumb={ja ? "テーマ別の寄付先" : "Causes"}
      title={titleFor(t.name[locale], locale)}
      emoji={t.emoji}
      summary={t.summary[locale]}
      facts={[[ja ? "地域" : "Area", ja ? "日本全国" : "Across Japan"]]}
      body={t.body}
      list={themeRecipients(t)}
      groups={t.groups?.map((g) => ({
        title: g.label[locale],
        list: g.slugs.map((s) => themeRecipients(t).find((r) => r.slug === s)).filter((r) => r !== undefined),
      }))}
    />
  );
}
