import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButtons } from "@/components/ShareButtons";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { ogImageUrl, pageMetadata, pageUrl } from "@/lib/seo";
import { operator } from "@/lib/site";

const content: Record<Locale, { title: string; lead: string; facts: [string, string][]; points: string[]; contact: string; images: string }> = {
  ja: {
    title: "報道関係の方へ",
    lead: "「ともに寄付」は、熊本地震・千葉の水害の被災地と、全国の児童養護施設・福祉団体への寄付先を、公式ページだけから探せる無料の寄付ポータルです。取材・掲載のご相談を歓迎します。",
    facts: [
      ["サイト名", "ともに寄付（英語名 Give Together）"],
      ["公開", "2026年10月"],
      ["運営", "Lumière Conseil（個人事業）"],
      ["掲載先", "107件（国内98件・海外9件）。令和8年熊本地震14件、千葉の水害4件、全国の児童養護施設40件など"],
      ["言語", "日本語・英語"],
      ["利用料", "寄付者・掲載団体とも無料。寄付は各団体・自治体の公式窓口へ直接届きます"],
    ],
    points: [
      "掲載しているのは、自治体と法人格のある団体（社会福祉法人・認定NPO法人など）の公式寄付ページだけです。個人への送金は扱いません。",
      "掲載前に、各団体・自治体の公式ページで寄付の受付中であることを確認しています。",
      "義援金・支援金・ふるさと納税の違いを説明するガイドページがあり、初めての人でも寄付先を選べます。",
      "当サイトが寄付金を預かることはありません。",
    ],
    contact: "取材のお申し込み・お問い合わせ",
    images: "掲載用画像（自由にお使いください）",
  },
  en: {
    title: "Press",
    lead: "Give Together is a free donation portal that gathers only official donation pages for the areas hit by the 2026 Kumamoto earthquake and the Chiba floods, and for children's homes and welfare groups across Japan. We welcome interviews and coverage.",
    facts: [
      ["Name", "Give Together (ともに寄付)"],
      ["Launched", "October 2026"],
      ["Operator", "Lumière Conseil (sole proprietorship, Japan)"],
      ["Listings", "107 (98 in Japan, 9 overseas), including 14 for the 2026 Kumamoto earthquake, 4 for the Chiba floods and 40 children's homes"],
      ["Languages", "Japanese and English"],
      ["Cost", "Free for donors and listed organisations. Gifts go straight to each organisation's official channel"],
    ],
    points: [
      "Only official donation pages of local governments and registered legal entities (social welfare corporations, certified NPOs and similar) are listed. No donations to individuals.",
      "Every listing is checked on the organisation's own official page before it goes up.",
      "A giving guide explains relief funds, support funds and furusato nozei so first-time donors can choose.",
      "The site never holds donated money.",
    ],
    contact: "Interview requests and enquiries",
    images: "Images for publication (free to use)",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? pageMetadata(locale, "/press", { title: content[locale].title, description: content[locale].lead }) : {};
}

export default async function PressPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const c = content[locale];
  return (
    <div className="container section prose">
      <p className="small muted">
        <Link href={`/${locale}`}>{t.siteName}</Link> › {c.title}
      </p>
      <h1>{c.title}</h1>
      <p className="lead">{c.lead}</p>
      <dl className="facts">
        {c.facts.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <ul>
        {c.points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <h2>{c.contact}</h2>
      <p>
        {operator.tradeName} / {operator.name}
        <br />
        <a href={`mailto:${operator.email}`}>{operator.email}</a> / {operator.phone}
      </p>
      <h2>{c.images}</h2>
      <p>
        <a href={ogImageUrl("ja")}>日本語版（1200×630 PNG）</a> · <a href={ogImageUrl("en")}>English (1200×630 PNG)</a>
      </p>
      <ShareButtons url={pageUrl(locale, "/press")} locale={locale} text={c.lead.slice(0, 90)} />
    </div>
  );
}
