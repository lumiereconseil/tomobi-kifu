import { sampleRecipients } from "./sample-recipients";
import type { Localized } from "./i18n";

export type Category = "municipality" | "welfare" | "disaster";
export type Region = "japan" | "world";

/**
 * How donations reach the recipient.
 * - direct: paid on this site via Stripe Connect into the recipient's own account
 *   (legal entities such as 社会福祉法人 and NPOs in Japan).
 * - external: we link to the recipient's official donation page. Used for local
 *   governments (receiving public money through a third party requires 指定公金事務取扱者
 *   designation), 義援金 (e.g. Japanese Red Cross), and overseas recipients (Stripe Japan
 *   cannot pay out abroad, so they go through partners such as GlobalGiving).
 */
export type Payment =
  | { mode: "direct" }
  | { mode: "external"; url: string; via: Localized };

export type Recipient = {
  slug: string;
  category: Category;
  region: Region;
  country: Localized;
  name: Localized;
  summary: Localized;
  description: Localized;
  /** Fundraising goal in JPY. */
  goalJpy: number;
  /** Amount raised so far in JPY. Replace with live totals from the database. */
  raisedJpy: number;
  supporters: number;
  /** Whether donations to this recipient may qualify for a tax deduction. */
  taxDeductible: boolean;
  /**
   * Stripe Connect account (acct_...) of the recipient. When set, donations are paid
   * straight to the recipient's own Stripe account instead of being held by the operator.
   */
  stripeAccountId?: string;
  payment: Payment;
  /** Fee for this recipient in percent; defaults to PLATFORM_FEE_PERCENT (10). */
  feePercent?: number;
  /**
   * Disaster emergency appeal: shown first on the home page with an urgent banner, and
   * charged a reduced 5% fee. Copy an existing entry and set this to launch a new appeal.
   */
  emergency?: { since: string };
  /** A company matching gifts to this recipient. */
  matching?: { sponsor: Localized; capJpy?: number };
  /**
   * False for organisations listed without a partnership: we only link to their official
   * donation page, and the page says so.
   */
  partner?: boolean;
  /** True for placeholder entries that are not real organisations. */
  sample: boolean;
  emoji: string;
};

// Shared defaults for organisations we only link to (no payment on this site).
const referral = {
  goalJpy: 0,
  raisedJpy: 0,
  supporters: 0,
  taxDeductible: false,
  partner: false,
  sample: false,
} as const;

// Real organisations, linked to their official donation pages (checked 2026-10-13). None of
// them is a partner yet, so nothing is paid on this site. Order is set by priorityRank.
const listed: Recipient[] = [
  {
    slug: "furusato-choice-saigai",
    category: "disaster",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "ふるさとチョイス 災害支援（被災自治体への寄付）", en: "Furusato Choice Disaster Support (gifts to affected municipalities)" },
    summary: {
      ja: "災害で被災した自治体に、ふるさと納税で直接寄付できます。",
      en: "Give directly to disaster-hit municipalities through furusato nozei.",
    },
    description: {
      ja: "被災した自治体ごとの支援プロジェクトから選んで寄付できます。寄付金は被災自治体に直接届き、ふるさと納税として寄付金控除の対象になります。",
      en: "Choose a support project from each affected municipality. Donations go directly to the municipality and qualify for the furusato nozei tax deduction.",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.furusato-tax.jp/saigai/", via: { ja: "ふるさとチョイス災害支援", en: "Furusato Choice Disaster Support" } },
    emoji: "🏘️",
  },
  {
    slug: "jrc-domestic-relief",
    category: "disaster",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "日本赤十字社 国内災害義援金", en: "Japanese Red Cross: Domestic Disaster Relief Fund" },
    summary: {
      ja: "国内の災害で被災した方々へ、義援金として届けられます。",
      en: "Relief money delivered to people affected by disasters in Japan.",
    },
    description: {
      ja: "義援金は被災した都道府県の義援金配分委員会を通じて、被災された方々へ配分されます。",
      en: "Relief money is distributed to affected people through each prefecture's allocation committee.",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.jrc.or.jp/contribute/help/#kokunai", via: { ja: "日本赤十字社の義援金窓口", en: "the Japanese Red Cross relief fund page" } },
    emoji: "🤝",
  },
  {
    slug: "hokuriku-mirai-kikin",
    category: "disaster",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "公益財団法人 ほくりくみらい基金（能登の復興）", en: "Hokuriku Mirai Foundation (Noto recovery)" },
    summary: {
      ja: "石川県で活動するNPOや市民団体の取り組みを助成で支えます。",
      en: "Grants for NPOs and citizen groups working in Ishikawa Prefecture.",
    },
    description: {
      ja: "石川県金沢市の公益財団法人です。寄付金は、能登の復興をはじめ、地域のNPOや市民団体の活動への助成に使われます。",
      en: "A public interest foundation in Kanazawa. Donations fund grants to local NPOs and citizen groups, including recovery work in Noto.",
    },
    ...referral,
    payment: { mode: "external", url: "https://hokuriku-mf.jp/donation", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🌾",
  },
  {
    slug: "peace-boat-disaster-relief",
    category: "disaster",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "公益社団法人 ピースボート災害支援センター", en: "Peace Boat Disaster Relief Volunteer Center" },
    summary: {
      ja: "被災地での緊急支援と、災害ボランティアの育成を行います。",
      en: "Emergency relief in disaster areas and training for disaster volunteers.",
    },
    description: {
      ja: "災害が起きた地域での緊急支援、すぐに動くための待機基金、災害ボランティアの育成や防災の取り組みに寄付金が使われます。",
      en: "Donations fund emergency relief where disasters strike, a standby fund for rapid response, and volunteer training and preparedness.",
    },
    ...referral,
    payment: { mode: "external", url: "https://pbv.or.jp/donate", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "⛑️",
  },
  {
    slug: "civic-force",
    category: "disaster",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "公益社団法人 Civic Force", en: "Civic Force" },
    summary: {
      ja: "災害時の迅速な緊急支援と、平時の備えを進めます。",
      en: "Rapid life-saving relief in disasters and preparedness in normal times.",
    },
    description: {
      ja: "大規模災害の際に、企業やNPOと連携して迅速に支援を届ける公益社団法人です。寄付金は緊急支援と災害への備えに使われます。",
      en: "A public interest corporation that works with companies and NPOs to deliver rapid relief after major disasters. Donations fund emergency response and preparedness.",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.civic-force.org/support", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🚁",
  },
  {
    slug: "japan-rescue",
    category: "disaster",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "認定NPO法人 日本レスキュー協会", en: "Japan Rescue Association" },
    summary: {
      ja: "災害救助犬の育成・出動と、保護犬猫の支援を行います。",
      en: "Training and deploying disaster rescue dogs, and caring for rescued animals.",
    },
    description: {
      ja: "兵庫県伊丹市を拠点に、災害救助犬の育成と被災地への出動、保護犬・保護猫の活動を行う認定NPO法人です。",
      en: "A certified NPO in Itami, Hyogo that trains and deploys disaster rescue dogs and cares for rescued dogs and cats.",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.japan-rescue.com/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🐕",
  },
  {
    slug: "houboku",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "認定NPO法人 抱樸", en: "Houboku" },
    summary: {
      ja: "福岡県北九州市を拠点に、生活に困っている人の自立を支えます。",
      en: "Helping people in hardship rebuild their lives, based in Kitakyushu.",
    },
    description: {
      ja: "炊き出しや訪問、子どもと家族の支援、住まいの支援などを通じて、困窮や孤立から抜け出す手助けをしている認定NPO法人です。",
      en: "A certified NPO that helps people escape poverty and isolation through soup kitchens, outreach, family support and housing assistance.",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.houboku.net/webdonation/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🍙",
  },
  {
    slug: "dxp",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "認定NPO法人 D×P", en: "D×P" },
    summary: {
      ja: "不登校や中退、経済的な困難を抱える10代の孤立をなくします。",
      en: "Ending isolation for teenagers facing school refusal, dropping out or poverty.",
    },
    description: {
      ja: "大阪を拠点に、食料や現金の支援、LINE相談、ミナミでのユースセンター運営などを行う認定NPO法人です。",
      en: "A certified NPO in Osaka providing food and cash aid, LINE counselling and a youth centre in Minami.",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.dreampossibility.com/supporter/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "💬",
  },
  {
    slug: "storia",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "認定NPO法人 STORIA", en: "STORIA" },
    summary: {
      ja: "宮城県仙台市で、子どもの貧困の連鎖を断つ活動をしています。",
      en: "Breaking the cycle of child poverty in Sendai.",
    },
    description: {
      ja: "宮城県仙台市を拠点に、困難を抱える子どもたちを支援する認定NPO法人です。",
      en: "A certified NPO in Sendai, Miyagi supporting children facing hardship.",
    },
    ...referral,
    payment: { mode: "external", url: "https://storia.or.jp/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "📖",
  },
  {
    slug: "kacotam",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "認定NPO法人 Kacotam", en: "Kacotam" },
    summary: {
      ja: "北海道札幌市で、子どもの学習支援を行います。",
      en: "Learning support for children in Sapporo.",
    },
    description: {
      ja: "北海道札幌市を拠点に、経済的に困難な家庭の子どもたちの学習を支援する認定NPO法人です。",
      en: "A certified NPO in Sapporo supporting the learning of children from families in hardship.",
    },
    ...referral,
    payment: { mode: "external", url: "https://kacotam.com/donation/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "✏️",
  },
  {
    slug: "foodbank-kansai",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "認定NPO法人 フードバンク関西", en: "Food Bank Kansai" },
    summary: {
      ja: "まだ食べられる食品を、必要とする人や施設へ届けます。",
      en: "Getting surplus food to people and facilities that need it.",
    },
    description: {
      ja: "兵庫県神戸市を拠点に、食品を集めて福祉施設や生活に困っている人へ届けるフードバンクです。",
      en: "A food bank in Kobe that collects food and delivers it to welfare facilities and people in need.",
    },
    ...referral,
    payment: { mode: "external", url: "https://foodbankkansai.org/support/donate/donate-money/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🥫",
  },
  {
    slug: "second-harvest-nagoya",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "認定NPO法人 セカンドハーベスト名古屋", en: "Second Harvest Nagoya" },
    summary: {
      ja: "東海地方で、食べものを必要とする人へ届けます。",
      en: "Delivering food to people in need in the Tokai region.",
    },
    description: {
      ja: "愛知県名古屋市を拠点に、寄付された食品を福祉施設や生活に困っている家庭へ届けるフードバンクです。",
      en: "A food bank in Nagoya delivering donated food to welfare facilities and families in need.",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.2h-nagoya.org/support/donate", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🍞",
  },
  {
    slug: "shine-on-kids",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "認定NPO法人 シャイン・オン・キッズ", en: "Shine On! Kids" },
    summary: {
      ja: "小児病棟で闘病する子どもと家族を支えます。",
      en: "Supporting children in hospital and their families.",
    },
    description: {
      ja: "重い病気と闘う子どもたちのそばに、病院で働くファシリティドッグを届けるなどの活動をしている認定NPO法人です。",
      en: "A certified NPO that brings hospital facility dogs and other support to seriously ill children.",
    },
    ...referral,
    payment: { mode: "external", url: "https://sokids.org/ja/how-to-help/donate2/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🏥",
  },
  {
    slug: "mirai-fund-okinawa",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "公益財団法人 みらいファンド沖縄", en: "Mirai Fund Okinawa" },
    summary: {
      ja: "沖縄の子どもと地域の活動を支えます。",
      en: "Supporting children and communities in Okinawa.",
    },
    description: {
      ja: "沖縄県浦添市の公益財団法人です。寄付金は沖縄の子どもや地域のための活動に使われます。",
      en: "A public interest foundation in Urasoe, Okinawa funding activities for local children and communities.",
    },
    ...referral,
    payment: { mode: "external", url: "https://miraifund.org/action", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🌺",
  },
  {
    slug: "jrc-overseas-relief",
    category: "disaster",
    region: "world",
    country: { ja: "世界各地", en: "Worldwide" },
    name: { ja: "日本赤十字社 海外救援金", en: "Japanese Red Cross: Overseas Relief Fund" },
    summary: {
      ja: "海外の災害や紛争で被害を受けた人々を支援します。",
      en: "Supporting people affected by disasters and conflicts overseas.",
    },
    description: {
      ja: "赤十字の国際的なネットワークを通じて、海外の被災地や紛争地で救援活動を行います。",
      en: "Relief work in disaster and conflict areas overseas through the international Red Cross network.",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.jrc.or.jp/contribute/help/#kaigai", via: { ja: "日本赤十字社の海外救援金窓口", en: "the Japanese Red Cross overseas relief page" } },
    emoji: "🌏",
  },
  {
    slug: "ivy",
    category: "disaster",
    region: "world",
    country: { ja: "世界各地・東北", en: "Worldwide and Tohoku" },
    name: { ja: "認定NPO法人 IVY", en: "IVY" },
    summary: {
      ja: "ほかの団体が入りにくい地域で、30年以上支援を続けています。",
      en: "Over 30 years of aid in places other groups find hard to reach.",
    },
    description: {
      ja: "山形県山形市の認定NPO法人です。海外9か国と、東日本大震災の被災地である東北で支援を行っています。",
      en: "A certified NPO in Yamagata supporting people in nine countries and in Tohoku, the region hit by the 2011 earthquake.",
    },
    ...referral,
    payment: { mode: "external", url: "https://ivyivy.org/support", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🕊️",
  },
  {
    slug: "globalgiving-disasters",
    category: "disaster",
    region: "world",
    country: { ja: "世界各地", en: "Worldwide" },
    name: { ja: "GlobalGiving 災害支援", en: "GlobalGiving Disaster Recovery" },
    summary: {
      ja: "世界各地の、地域に根ざした災害支援に寄付できます。",
      en: "Give to locally led disaster relief and recovery around the world.",
    },
    description: {
      ja: "海外の寄付プラットフォーム GlobalGiving で、世界各地の災害ごとの基金に寄付できます。",
      en: "Donate to disaster-specific funds around the world on GlobalGiving, an international giving platform.",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.globalgiving.org/disasters/", via: { ja: "GlobalGiving", en: "GlobalGiving" } },
    emoji: "🌊",
  },
];

export const recipients: Recipient[] =
  process.env.NEXT_PUBLIC_DEMO_SAMPLES === "1" ? [...listed, ...sampleRecipients] : listed;

/**
 * Listing order (Masa, 2026-10-13): disaster-affected areas and welfare facilities in Japan
 * first, then other Japanese recipients, then overseas disaster areas and other causes.
 */
export function priorityRank(r: Recipient): number {
  const domestic = r.region === "japan";
  if (domestic && r.emergency) return 0;
  if (domestic && r.category === "disaster") return 1;
  if (domestic && r.category === "welfare") return 2;
  if (domestic) return 3;
  if (r.category === "disaster") return 4;
  return 5;
}

export function byPriority(a: Recipient, b: Recipient): number {
  return priorityRank(a) - priorityRank(b);
}

export function isDirect(r: Recipient): boolean {
  return r.payment.mode === "direct";
}

export function getRecipient(slug: string): Recipient | undefined {
  return recipients.find((r) => r.slug === slug);
}
