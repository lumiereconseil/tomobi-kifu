import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionPage } from "@/components/CollectionPage";
import { disasters } from "@/lib/disasters";
import { isLocale, type Locale } from "@/lib/i18n";
import { byPriority, recipients, type Recipient } from "@/lib/recipients";
import { pageMetadata } from "@/lib/seo";

/** Recipients that take international cards for Japanese disasters (Masa, 2026-10-27: overseas expansion). */
const fromAbroadSlugs = ["globalgiving-jpf-kumamoto-2026", "globalgiving-civic-force-kumamoto-2026", "jrc-2026-kumamoto-earthquake"];
/** Disaster guides for crises outside Japan. */
const worldDisasterSlugs = ["nepal-2026-floods", "venezuela-2026-earthquake", "middle-east-crisis"];

const copy: Record<Locale, { title: string; summary: string; crumb: string; fromAbroad: string; world: string }> = {
  ja: {
    title: "海外支援：世界の被災地へ・海外から日本へ",
    summary: "世界の被災地へ日本から寄付できる窓口と、海外にお住まいの方が日本の被災地へ寄付できる窓口をまとめました。",
    crumb: "海外支援",
    fromAbroad: "海外から日本の被災地へ",
    world: "世界の被災地へ",
  },
  en: {
    title: "Give globally: help Japan from abroad, and the world from Japan",
    summary:
      "Live outside Japan and want to help Kumamoto recover? Or want to support disaster areas around the world? Here are verified ways to give, including options that accept international cards.",
    crumb: "Give globally",
    fromAbroad: "Help Japan's disaster areas from abroad",
    world: "Help disaster areas around the world",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, "/global", { title: copy[locale].title, description: copy[locale].summary });
}

export default async function GlobalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = copy[locale];
  const ja = locale === "ja";
  const fromAbroad = fromAbroadSlugs
    .map((s) => recipients.find((r) => r.slug === s))
    .filter((r): r is Recipient => Boolean(r));
  const world = recipients.filter((r) => r.region === "world").sort(byPriority);
  const guides = disasters.filter((d) => worldDisasterSlugs.includes(d.slug));

  return (
    <>
      <CollectionPage
        locale={locale}
        path="/global"
        crumb={c.crumb}
        title={c.title}
        emoji="🌏"
        summary={c.summary}
        facts={[[ja ? "対象" : "Covers", ja ? "日本の被災地・海外の被災国" : "Japan's disaster areas and disaster-hit countries"]]}
        body={[
          {
            ja: "海外にお住まいの方は、GlobalGiving（米国の寄付サイト）にある日本のNGOの窓口なら、海外発行のカードで熊本地震の被災地へ寄付できます。日本赤十字社の義援金は海外からの銀行送金（SWIFT）も受け付けています（在タイ日本国大使館の案内による）。",
            en: "If you live outside Japan, the appeals Japanese NGOs run on GlobalGiving (a US giving platform) accept international cards for the Kumamoto earthquake. The Japanese Red Cross relief fund also accepts international bank transfers (SWIFT), according to the Embassy of Japan in Thailand.",
          },
          {
            ja: "日本から世界の被災地へは、日本の認定NPOなどに円で寄付すると寄附金控除の対象になる場合があります。現地の小さな団体を支えたい場合は、GlobalGiving の基金も選べます。日本の決済サービスは海外の団体へ直接入金できないため、当サイトはどちらも公式ページへのご案内のみ行い、寄付金を預かりません。",
            en: "From Japan, gifts in yen to Japanese certified NPOs may qualify for a tax deduction. To reach small local groups, you can also give to GlobalGiving's funds. We only link to official pages and never hold your money.",
          },
        ]}
        list={[...fromAbroad, ...world]}
        groups={[
          { title: c.fromAbroad, list: fromAbroad },
          { title: c.world, list: world },
        ]}
      />
      <section className="container section disaster-strip">
        <h2>{ja ? "海外の災害別ページ" : "Guides by disaster"}</h2>
        <div className="disaster-links">
          {guides.map((d) => (
            <Link key={d.slug} href={`/${locale}/disasters/${d.slug}`} className="disaster-link">
              <span aria-hidden>{d.emoji}</span>
              <span>
                <strong>{d.name[locale]}</strong>
                <small>{d.area[locale]}</small>
              </span>
            </Link>
          ))}
          <Link href={`/${locale}/disasters/kumamoto-2026-earthquake`} className="disaster-link">
            <span aria-hidden>🏯</span>
            <span>
              <strong>{ja ? "令和8年熊本地震" : "2026 Kumamoto Earthquake"}</strong>
              <small>{ja ? "国内の窓口もすべて見る" : "All ways to give, including Japanese-only pages"}</small>
            </span>
          </Link>
        </div>
        <p className="small muted">
          <a href="https://www.th.emb-japan.go.jp/itpr_en/pr26_14.html" rel="noopener" target="_blank">
            {ja ? "在タイ日本国大使館：熊本地震への寄付の案内（英語）" : "Embassy of Japan in Thailand: Donations for the 2026 Kumamoto Earthquake"}
          </a>
        </p>
      </section>
    </>
  );
}
