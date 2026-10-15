import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { disasters } from "@/lib/disasters";
import { isLocale, type Locale } from "@/lib/i18n";
import { pageMetadata, pageUrl } from "@/lib/seo";

type Section = { h: string; p: string[] };

const content: Record<Locale, { title: string; description: string; lead: string; sections: Section[]; faq: [string, string][] }> = {
  ja: {
    title: "寄付の選び方：義援金・支援金・ふるさと納税の違い",
    description:
      "災害の寄付には、義援金・支援金・自治体への寄附（ふるさと納税）があります。お金の届き方、使われ方、寄附金控除の違いと、寄付詐欺を避けるポイントをまとめました。",
    lead: "災害が起きたときの寄付は、大きく3つに分かれます。どれが良い・悪いではなく、届け先と使われ方が違います。",
    sections: [
      {
        h: "義援金：被災した方へ直接届けたいとき",
        p: [
          "日本赤十字社や共同募金会、被災した自治体が受け付けます。集まったお金は都道府県などの配分委員会を通じて、被害の程度に応じて被災した方へ公平に配られます。",
          "全額が被災した方に届く一方、被害の確認や配分の手続きがあるため、届くまでに時間がかかります。",
        ],
      },
      {
        h: "支援金：いま現地で動く団体を支えたいとき",
        p: [
          "NPO・NGO・社会福祉法人などの活動資金になります。炊き出し、物資の配布、避難所の運営、ボランティアの派遣など、すぐに必要な活動に使われます。",
          "団体ごとに活動内容が違うので、何に使われるかを公式ページや活動報告で確かめてから選ぶのがおすすめです。",
        ],
      },
      {
        h: "自治体への寄附（ふるさと納税）：復旧・復興の事業に使ってほしいとき",
        p: [
          "被災した市町村や県に直接寄附します。道路や施設の復旧、被災者支援などの事業に使われます。災害支援の寄附は返礼品がないのが一般的です。",
          "ふるさと納税として寄附すると、自己負担の2,000円を超える部分が、上限の範囲内で所得税・住民税から控除されます。確定申告が不要な給与所得者で寄附先が5団体以内なら、ワンストップ特例の申請で手続きを済ませられます。",
        ],
      },
      {
        h: "寄附金控除について",
        p: [
          "控除の対象になるかは寄付先によります。自治体への寄附、日本赤十字社や共同募金会の義援金、認定NPO法人・公益法人への寄付は、控除の対象になることが多いです。",
          "控除を受けるには受領証（領収書）が必要です。対象かどうかと受領証の発行方法は、寄付する前に寄付先の公式ページで確認してください。",
        ],
      },
      {
        h: "寄付詐欺を避けるために",
        p: [
          "災害のあとには、実在する団体や自治体を名乗る偽の募金が出回ることがあります。寄付は、団体や自治体の公式ウェブサイトから行うのが確実です。",
          "個人名義の口座への振込を求めるもの、電話やSNSのメッセージで急かすもの、使い道や団体の所在地がはっきりしないものには注意してください。",
          "当サイトに掲載している寄付先は、すべて公式ページを開いて受付中であることを確かめたものです。リンク先も公式ページです。",
        ],
      },
      {
        h: "物資よりお金の寄付を",
        p: [
          "多くの被災自治体は、個人からの救援物資を受け付けていません。仕分けや保管に人手がかかり、必要な物と届く物がずれやすいためです。物資を送る前に、自治体の公式発表を確認してください。",
        ],
      },
    ],
    faq: [
      ["義援金と支援金、どちらが良いですか？", "被災した方の生活に直接届けたいなら義援金、いま現地で活動する団体を支えたいなら支援金です。両方に少しずつ寄付する方法もあります。"],
      ["ふるさと納税で災害支援の寄附はできますか？", "できます。被災した自治体の公式ページや、ふるさと納税サイトの災害支援ページから寄附できます。返礼品はないのが一般的です。"],
      ["寄付は当サイトを経由しますか？", "いいえ。当サイトは公式の寄付ページへご案内するだけで、寄付金を預かることも手数料をいただくこともありません。"],
    ],
  },
  en: {
    title: "How to give after a disaster in Japan: relief funds, support funds and furusato nozei",
    description:
      "Disaster giving in Japan comes in three forms: relief funds (gienkin), support funds for relief organisations, and donations to municipalities (furusato nozei). Here is how each works, how tax relief applies, and how to avoid donation scams.",
    lead: "When disaster strikes in Japan, gifts fall into three kinds. None is better than the others; they reach different people and are used in different ways.",
    sections: [
      {
        h: "Relief funds (gienkin): to reach affected residents directly",
        p: [
          "Collected by the Japanese Red Cross, the Community Chest and affected municipalities. The money is passed through prefectural distribution committees and shared fairly among affected residents according to the damage they suffered.",
          "The full amount reaches residents, but damage assessment and distribution take time.",
        ],
      },
      {
        h: "Support funds: to back organisations working on the ground now",
        p: [
          "These fund the work of NPOs, NGOs and social welfare corporations: hot meals, relief supplies, running evacuation centres and sending volunteers.",
          "Each organisation does different work, so check its official page or activity reports to see how the money will be used.",
        ],
      },
      {
        h: "Donations to municipalities (furusato nozei): to fund recovery projects",
        p: [
          "Give directly to the affected city, town or prefecture. The money funds rebuilding roads and facilities and supporting residents. Disaster-support donations usually come with no return gifts.",
          "Taxpayers in Japan who give through furusato nozei can deduct the amount above ¥2,000 from income and resident tax, up to a limit.",
        ],
      },
      {
        h: "Giving from outside Japan",
        p: [
          "Many official pages are in Japanese only and some accept only Japanese payment methods. Check each official page for the payment methods it accepts from abroad, or give through international platforms such as GlobalGiving, which accept international cards.",
          "Tax relief in your own country depends on your local rules; Japanese tax deductions apply only to taxpayers in Japan.",
        ],
      },
      {
        h: "Avoiding donation scams",
        p: [
          "Fake appeals using the names of real organisations and municipalities appear after disasters. Give through the official website of the organisation or municipality.",
          "Be careful with requests to pay into a personal bank account, messages that pressure you by phone or social media, and appeals that do not say how the money will be used.",
          "Every recipient on this site was checked on its official page, and our links go to those official pages.",
        ],
      },
    ],
    faq: [
      ["Should I give to a relief fund or a support fund?", "Choose a relief fund to reach affected residents directly, or a support fund to back organisations working now. You can also split your gift."],
      ["Can I donate from overseas?", "Yes. Check each official page for the payment methods it accepts from abroad. International platforms such as GlobalGiving also accept international cards."],
      ["Does my donation pass through this site?", "No. We only link to official donation pages. We never hold donated money and charge no fee."],
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? pageMetadata(locale, "/guide", { title: content[locale].title, description: content[locale].description }) : {};
}

export default async function Guide({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = content[locale];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: pageUrl(locale, "/guide"),
    mainEntity: c.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  return (
    <div className="container section prose">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <h1>{c.title}</h1>
      <p className="lead">{c.lead}</p>
      {c.sections.map((s) => (
        <section key={s.h}>
          <h2>{s.h}</h2>
          {s.p.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
      ))}
      <h2>{locale === "ja" ? "よくある質問" : "FAQ"}</h2>
      <dl className="faq">
        {c.faq.map(([q, a]) => (
          <div key={q}>
            <dt>{q}</dt>
            <dd>{a}</dd>
          </div>
        ))}
      </dl>
      <h2>{locale === "ja" ? "災害別の寄付先" : "Where to give, by disaster"}</h2>
      <ul>
        {disasters.map((d) => (
          <li key={d.slug}>
            <Link href={`/${locale}/disasters/${d.slug}`}>{d.name[locale]}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
