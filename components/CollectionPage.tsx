import Link from "next/link";
import { RecipientCard } from "@/components/RecipientCard";
import { getDictionary, type Locale, type Localized } from "@/lib/i18n";
import type { Recipient } from "@/lib/recipients";
import { pageUrl } from "@/lib/seo";

/** Shared layout for the disaster and cause pages: intro, key facts and the recipient grid. */
export function CollectionPage({
  locale,
  path,
  crumb,
  title,
  emoji,
  summary,
  facts,
  body,
  list,
}: {
  locale: Locale;
  path: string;
  crumb: string;
  title: string;
  emoji: string;
  summary: string;
  facts: [string, string][];
  body: Localized[];
  list: Recipient[];
}) {
  const t = getDictionary(locale);
  const ja = locale === "ja";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    url: pageUrl(locale, path),
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
          <Link href={`/${locale}`}>{t.siteName}</Link> › {crumb}
        </p>
        <h1>
          <span aria-hidden>{emoji}</span> {title}
        </h1>
        <p className="lead">{summary}</p>
        <dl className="facts">
          {[...facts, [ja ? "寄付先" : "Ways to give", ja ? `${list.length}件` : String(list.length)]].map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        {body.map((p) => (
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
