import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionPage } from "@/components/CollectionPage";
import { disasterRecipients, disasters, getDisaster } from "@/lib/disasters";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.flatMap((locale) => disasters.map((d) => ({ locale, slug: d.slug })));
}

type Params = Promise<{ locale: string; slug: string }>;

const titleFor = (name: string, locale: Locale) =>
  locale === "ja" ? `${name}の寄付先・義援金の窓口` : `${name}: how to donate`;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const d = getDisaster(slug);
  if (!d || !isLocale(locale)) return {};
  return pageMetadata(locale, `/disasters/${slug}`, { title: titleFor(d.name[locale], locale), description: d.summary[locale] });
}

export default async function DisasterPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDisaster(slug);
  if (!d) notFound();
  const ja = locale === "ja";
  // Formatted from the string so the server's time zone cannot shift the day.
  const [y, m, day] = d.since.split("-").map(Number);
  const since = ja
    ? `${y}年${m}月${day}日`
    : `${day} ${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][m - 1]} ${y}`;

  return (
    <CollectionPage
      locale={locale}
      path={`/disasters/${slug}`}
      crumb={ja ? "災害別の寄付先" : "Disasters"}
      title={titleFor(d.name[locale], locale)}
      emoji={d.emoji}
      summary={d.summary[locale]}
      facts={[
        [ja ? "地域" : "Area", d.area[locale]],
        [ja ? "発生・受付開始" : "Since", since],
      ]}
      body={d.body}
      list={disasterRecipients(d)}
    />
  );
}
