import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RecipientCard } from "@/components/RecipientCard";
import { disasterRecipients, disasters, getDisaster } from "@/lib/disasters";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { pageMetadata, pageUrl } from "@/lib/seo";

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
  const t = getDictionary(locale);
  const list = disasterRecipients(d);
  const ja = locale === "ja";
  // Formatted from the string so the server's time zone cannot shift the day.
  const [y, m, day] = d.since.split("-").map(Number);
  const since = ja
    ? `${y}年${m}月${day}日`
    : `${day} ${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][m - 1]} ${y}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: titleFor(d.name[locale], locale),
    url: pageUrl(locale, `/disasters/${slug}`),
    itemListElement: list.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: r.name[locale],
      url: pageUrl(locale, `/recipients/${r.slug}`),
    })),
  };

  return (
    <div className="container section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="prose">
        <p className="small muted">
          <Link href={`/${locale}`}>{t.siteName}</Link> › {ja ? "災害別の寄付先" : "Disasters"}
        </p>
        <h1>
          <span aria-hidden>{d.emoji}</span> {titleFor(d.name[locale], locale)}
        </h1>
        <p className="lead">{d.summary[locale]}</p>
        <dl className="facts">
          <div>
            <dt>{ja ? "地域" : "Area"}</dt>
            <dd>{d.area[locale]}</dd>
          </div>
          <div>
            <dt>{ja ? "発生・受付開始" : "Since"}</dt>
            <dd>{since}</dd>
          </div>
          <div>
            <dt>{ja ? "寄付先" : "Ways to give"}</dt>
            <dd>{ja ? `${list.length}件` : list.length}</dd>
          </div>
        </dl>
        {d.body.map((p) => (
          <p key={p.ja}>{p[locale]}</p>
        ))}
        <p>
          <Link href={`/${locale}/guide`}>{ja ? "→ 義援金・支援金・ふるさと納税の違い（寄付の選び方）" : "→ Relief funds, support funds and furusato nozei: our giving guide"}</Link>
        </p>
        <p className="notice">{t.referralNotice}</p>
      </div>
      <div className="grid disaster-grid">
        {list.map((r) => (
          <RecipientCard key={r.slug} r={r} locale={locale} t={t} />
        ))}
      </div>
      <p className="small muted disaster-checked">
        {ja
          ? "掲載内容は各団体・自治体の公式ページで確認した情報です。受付期間や控除の扱いは、寄付の前に公式ページでご確認ください。"
          : "Details were checked on each organisation's official page. Please confirm deadlines and tax treatment on the official page before giving."}
      </p>
    </div>
  );
}
