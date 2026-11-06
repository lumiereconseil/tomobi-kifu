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

// Real organisations, linked to their official donation pages (checked 2026-10-13; additions 2026-10-14 and 2026-10-15). None of
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
    slug: "kumamoto-pref-2026-earthquake",
    category: "municipality",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "熊本県 令和8年熊本地震 復興支援寄附金", en: "Kumamoto Prefecture: 2026 Kumamoto Earthquake Recovery Donations" },
    summary: {
      ja: "令和8年熊本地震からの復興のため、熊本県に直接寄付できます。",
      en: "Give directly to Kumamoto Prefecture for recovery from the 2026 Kumamoto earthquake.",
    },
    description: {
      ja: "熊本県の公式ページから、ふるさと納税として寄付できます(返礼品はありません)。2,000円を超える部分が所得税・住民税から控除されると県のページに書かれています。",
      en: "Donate to the prefecture through furusato nozei (no return gifts). The prefecture's page states that the amount above ¥2,000 is deductible from income and resident tax.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.pref.kumamoto.jp/soshiki/16/278272.html", via: { ja: "自治体の公式寄附ページ", en: "the municipality's official donation page" } },
    emergency: { since: "2026-07-28" },
    emoji: "🏯",
  },
  {
    slug: "kumamoto-city-2026-earthquake",
    category: "municipality",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "熊本市 令和8年熊本地震 災害支援寄附", en: "Kumamoto City: 2026 Earthquake Disaster Support" },
    summary: {
      ja: "熊本市の復旧・復興のための災害支援寄附です。",
      en: "Disaster-support donations for Kumamoto City's recovery.",
    },
    description: {
      ja: "令和8年熊本地震で被害を受けた熊本市の復旧・復興に使われます。市の公式ページから、ふるさと納税サイトを通じて寄付できます(返礼品はありません)。",
      en: "Used for Kumamoto City's recovery from the 2026 earthquake. The city's official page links to furusato nozei sites (no return gifts).",
    },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://www.city.kumamoto.jp/kiji00372174/index.html", via: { ja: "自治体の公式寄附ページ", en: "the municipality's official donation page" } },
    emergency: { since: "2026-07-28" },
    emoji: "🏙️",
  },
  {
    slug: "yatsushiro-2026-earthquake",
    category: "municipality",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "熊本県八代市 令和8年熊本地震 義援金・寄附金", en: "Yatsushiro City: 2026 Kumamoto Earthquake Relief and Donations" },
    summary: {
      ja: "八代市の被災者支援と、災害からの復旧・復興に使われます。",
      en: "For victim support and disaster recovery in Yatsushiro.",
    },
    description: {
      ja: "八代市が、令和8年熊本地震の被災者支援と災害復旧・復興のための義援金・寄附金を受け付けています。市のページには寄附金控除の対象と書かれています。",
      en: "Yatsushiro City accepts relief money and donations for victim support and recovery after the 2026 Kumamoto earthquake. The city states that gifts are tax-deductible.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.city.yatsushiro.lg.jp/kiji00326782/index.html", via: { ja: "自治体の公式寄附ページ", en: "the municipality's official donation page" } },
    emergency: { since: "2026-07-28" },
    emoji: "🌊",
  },
  {
    slug: "hikawa-2026-earthquake",
    category: "municipality",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "熊本県氷川町 令和8年熊本地震 義援金・寄附金", en: "Hikawa Town: 2026 Kumamoto Earthquake Relief and Donations" },
    summary: {
      ja: "震度7を観測した氷川町の、被災者支援と災害復旧に使われます。",
      en: "For victim support and recovery in Hikawa, where intensity 7 shaking was recorded.",
    },
    description: {
      ja: "義援金は被害の程度に応じて被災者へ配分され、寄附金とふるさと納税は災害復旧や被災者支援に使われます。町のページには寄附金控除の対象と書かれています。",
      en: "Relief money is distributed to affected residents by level of damage; donations and furusato nozei fund recovery and victim support. The town states that gifts are tax-deductible.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.town.hikawa.kumamoto.jp/kiji0036758/index.html", via: { ja: "自治体の公式寄附ページ", en: "the municipality's official donation page" } },
    emergency: { since: "2026-07-28" },
    emoji: "🌾",
  },
  {
    slug: "uki-2026-earthquake",
    category: "municipality",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "熊本県宇城市 令和8年熊本地震 義援金・寄附金", en: "Uki City: 2026 Kumamoto Earthquake Relief and Donations" },
    summary: {
      ja: "震度7を観測した宇城市の、被災者の生活再建と復旧・復興に使われます。",
      en: "For rebuilding lives and recovery in Uki, where intensity 7 shaking was recorded.",
    },
    description: {
      ja: "寄附金は市が行う被災者支援と復旧・復興の事業に、義援金は被災した市民の生活支援と再建に使われます。義援金の受付は2027年3月31日までの予定です。",
      en: "Donations fund the city's victim support and recovery projects; relief money supports affected residents. Relief money is accepted until 31 March 2027 (planned).",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.city.uki.kumamoto.jp/toppage/important/2610597", via: { ja: "自治体の公式寄附ページ", en: "the municipality's official donation page" } },
    emergency: { since: "2026-07-28" },
    emoji: "🍊",
  },
  {
    slug: "akaihane-kumamoto-2026-gienkin",
    category: "disaster",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "熊本県共同募金会 令和8年熊本地震義援金", en: "Kumamoto Community Chest: 2026 Kumamoto Earthquake Relief Fund" },
    summary: {
      ja: "義援金として、熊本地震で被災した方々へ届けられます。",
      en: "Relief money delivered to people affected by the 2026 Kumamoto earthquake.",
    },
    description: {
      ja: "社会福祉法人 熊本県共同募金会が受け付ける義援金です。県・日本赤十字社熊本県支部・共同募金会でつくる配分委員会を通じて、被災した市町村へ送られます。受付は2027年3月31日まで(延長の告知あり)。",
      en: "Collected by the Kumamoto Prefectural Community Chest and passed through the distribution committee to affected municipalities. Open until 31 March 2027 (extension announced).",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.akaihane-kumamoto.jp/2026/07/31/3936/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emergency: { since: "2026-07-28" },
    emoji: "🪶",
  },
  {
    slug: "jrc-2026-kumamoto-earthquake",
    category: "disaster",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "日本赤十字社 令和8年熊本地震災害義援金", en: "Japanese Red Cross: 2026 Kumamoto Earthquake Relief Fund" },
    summary: {
      ja: "義援金の全額が、熊本県の義援金配分委員会へ送られます。",
      en: "All relief money is sent to Kumamoto Prefecture's distribution committee.",
    },
    description: {
      ja: "被災した方々の生活を支えるため、日本赤十字社が受け付けている義援金です。受付は2027年3月31日までです。",
      en: "Relief money collected by the Japanese Red Cross to support the daily lives of affected people. Open until 31 March 2027.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.jrc.or.jp/contribute/help/20260731/", via: { ja: "日本赤十字社の義援金窓口", en: "the Japanese Red Cross relief fund page" } },
    emergency: { since: "2026-07-28" },
    emoji: "🤝",
  },
  {
    slug: "borasapo-2026-kumamoto",
    category: "disaster",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "中央共同募金会 ボラサポ・令和8年熊本地震", en: "Central Community Chest: Volunteer and NPO Support Fund for the 2026 Kumamoto Earthquake" },
    summary: {
      ja: "被災地で活動するNPOやボランティアグループの活動費を助成します。",
      en: "Grants for NPOs and volunteer groups working in the disaster area.",
    },
    description: {
      ja: "社会福祉法人 中央共同募金会(赤い羽根)の災害ボランティア・NPO活動サポート募金です。被災した方を支える現地の団体の活動費に使われます。",
      en: "A fund run by the Central Community Chest of Japan (Red Feather). Donations pay for the work of local groups supporting affected people.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.akaihane.or.jp/saigai/2026kumamoto_earthquake/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emergency: { since: "2026-07-28" },
    emoji: "🪶",
  },
  {
    slug: "jpf-2026-kumamoto",
    category: "disaster",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "ジャパン・プラットフォーム 令和8年熊本地震被災者支援", en: "Japan Platform: 2026 Kumamoto Earthquake Response" },
    summary: {
      ja: "保健医療、食料、水と衛生、生活物資、避難所の支援に使われます。",
      en: "Funds health care, food, water and sanitation, relief goods and shelter.",
    },
    description: {
      ja: "NGO・経済界・行政が連携する緊急人道支援の組織、ジャパン・プラットフォームの熊本地震プログラムです。受付は2027年7月29日までです。",
      en: "Japan Platform links NGOs, business and government for emergency humanitarian aid. This programme runs until 29 July 2027.",
    },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://www.japanplatform.org/emergency/program/kumamoto_earthquake2026.html", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emergency: { since: "2026-07-28" },
    emoji: "🚑",
  },
  {
    slug: "chiba-2026-heavy-rain",
    category: "municipality",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "千葉県千葉市 令和8年8月千葉豪雨等 災害支援寄附金", en: "Chiba City: August 2026 Heavy Rain Disaster Support" },
    summary: {
      ja: "8月の豪雨と台風25号の被災者支援と復旧に使われます。",
      en: "For victim support and recovery after the August 2026 heavy rain and Typhoon No. 25.",
    },
    description: {
      ja: "千葉市の公式ページから、ふるさと納税サイトを通じて寄付できます(返礼品はありません)。",
      en: "Donate through furusato nozei sites linked from the city's official page (no return gifts).",
    },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://www.city.chiba.jp/zaiseikyoku/zaisei/shikin/r808-chibagouu.html", via: { ja: "自治体の公式寄附ページ", en: "the municipality's official donation page" } },
    emergency: { since: "2026-08-13" },
    emoji: "☔",
  },
  {
    slug: "hakui-2026-heavy-rain",
    category: "municipality",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "石川県羽咋市 令和8年8月豪雨 災害支援寄付", en: "Hakui City: August 2026 Heavy Rain Disaster Support" },
    summary: {
      ja: "8月の豪雨で被災した羽咋市の復興に使われます。",
      en: "For Hakui's recovery from the August 2026 heavy rain.",
    },
    description: {
      ja: "羽咋市の公式ページから、ふるさと納税サイトを通じて災害支援の寄付ができます。",
      en: "Donate for disaster support through furusato nozei sites linked from the city's official page.",
    },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://www.city.hakui.lg.jp/kurashi_tetsuduki/furusatonouzei/17446.html", via: { ja: "自治体の公式寄附ページ", en: "the municipality's official donation page" } },
    emergency: { since: "2026-08-27" },
    emoji: "⛈️",
  },
  {
    slug: "suzu-noto",
    category: "municipality",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "石川県珠洲市 義援金・寄附金(能登半島地震)", en: "Suzu City: Noto Earthquake Relief and Donations" },
    summary: {
      ja: "義援金はすべて珠洲市の被災者へ、寄附金は復旧・復興と防災に使われます。",
      en: "Relief money goes entirely to Suzu's affected residents; donations fund recovery and disaster prevention.",
    },
    description: {
      ja: "能登半島の先端にある珠洲市が、能登半島地震の義援金と寄附金を当分の間受け付けています。市のページには寄附金控除の対象と書かれています。",
      en: "Suzu, at the tip of the Noto Peninsula, continues to accept relief money and donations for the Noto earthquake. The city states that gifts are tax-deductible.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.city.suzu.lg.jp/site/bousaisuzu/11594.html", via: { ja: "自治体の公式寄附ページ", en: "the municipality's official donation page" } },
    emoji: "🌅",
  },
  {
    slug: "nanao-noto-gienkin",
    category: "municipality",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "石川県七尾市 能登半島地震 災害義援金", en: "Nanao City: Noto Earthquake Relief Fund" },
    summary: {
      ja: "能登半島地震で被災した七尾市の方々を支える義援金です。",
      en: "Relief money for people in Nanao affected by the Noto earthquake.",
    },
    description: {
      ja: "七尾市が義援金の口座を開設しています。市のページには寄附金控除や損金算入ができると書かれています。",
      en: "Nanao City runs a relief fund account. The city states that gifts are tax-deductible for individuals and companies.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.city.nanao.lg.jp/fukushi/gienkin.html", via: { ja: "自治体の公式寄附ページ", en: "the municipality's official donation page" } },
    emoji: "⚓",
  },
  {
    slug: "bussien",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人 佛子園(能登の復興)", en: "Bussien (Noto recovery)" },
    summary: {
      ja: "輪島などで福祉施設を運営する社会福祉法人の、能登の復興を支えます。",
      en: "Supports Noto's recovery through a welfare corporation running facilities in Wajima and beyond.",
    },
    description: {
      ja: "石川県白山市に本部を置き、輪島市でも福祉の拠点を運営する社会福祉法人です。寄付は奥能登豪雨からの復旧、能登半島地震からの復興、福祉事業に使われます。",
      en: "A social welfare corporation based in Hakusan with facilities in Wajima. Donations fund recovery from the Oku-Noto heavy rain, reconstruction after the Noto earthquake, and welfare services.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://congrant.com/project/bussien/13438", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🏡",
  },
  {
    slug: "rescue-stock-yard",
    category: "disaster",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "認定NPO法人 レスキューストックヤード", en: "Rescue Stock Yard" },
    summary: {
      ja: "被災地の支援と、防災の取り組みを進めます。",
      en: "Disaster-area support and preparedness.",
    },
    description: {
      ja: "愛知県名古屋市を拠点に、被災地の支援や復興支援、防災の啓発、災害時の緊急対応を行っています。寄付するときに支援したい災害を指定できます。",
      en: "Based in Nagoya, it supports disaster areas and recovery, runs preparedness education and responds rapidly to emergencies. Donors can name the disaster they want to support.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://rsy-nagoya.com/volunteer/kifu.html", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🧰",
  },
  {
    slug: "kidsdoor",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "認定NPO法人 キッズドア", en: "Kids Door" },
    summary: {
      ja: "経済的に困難な家庭の子どもの学習を支えます。",
      en: "Learning support for children from low-income families.",
    },
    description: {
      ja: "東京都中央区の認定NPO法人です。寄付は教材や学習会での夕食など、子どもの学習支援に使われます。",
      en: "A certified NPO in Tokyo. Donations pay for children's learning support, including materials and meals at study sessions.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://kidsdoor.net/support", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "📚",
  },
  {
    slug: "bridge-for-smile",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "認定NPO法人 ブリッジフォースマイル", en: "Bridge for Smile" },
    summary: {
      ja: "親を頼れない子どもたちの巣立ちを支えます。",
      en: "Helps young people leaving care start independent lives.",
    },
    description: {
      ja: "児童養護施設などを巣立つ若者に、セミナーや相談、メンターなどの支援を行う認定NPO法人です。",
      en: "A certified NPO supporting young people leaving children's homes with seminars, counselling and mentoring.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.b4s.jp/contribution/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🕊️",
  },
  {
    slug: "musubie",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "認定NPO法人 全国こども食堂支援センター・むすびえ", en: "Musubie (National Children's Cafeteria Support Center)" },
    summary: {
      ja: "全国のこども食堂を支えます。",
      en: "Supports children's cafeterias across Japan.",
    },
    description: {
      ja: "東京都渋谷区の認定NPO法人です。寄付はこども食堂でのプログラム、こども食堂の実態調査、むすびえの活動に使われます。",
      en: "A certified NPO in Tokyo. Donations fund programmes at children's cafeterias, research on their situation, and Musubie's work.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://musubie.org/support", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🍙",
  },
  {
    slug: "second-harvest-japan",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "認定NPO法人 セカンドハーベスト・ジャパン", en: "Second Harvest Japan" },
    summary: {
      ja: "まだ食べられる食品を、必要としている人へ届けます。",
      en: "Delivers surplus food to people in need.",
    },
    description: {
      ja: "東京都台東区を拠点とする、日本で最初のフードバンクです。",
      en: "Japan's first food bank, based in Taito, Tokyo.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://2hj.org/donate/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🥫",
  },
  {
    slug: "jdss",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "公益財団法人 日本ダウン症協会 輝くみらい募金", en: "Japan Down Syndrome Society: Bright Future Fund" },
    summary: {
      ja: "ダウン症のある人と家族を支える活動に使われます。",
      en: "Supports people with Down syndrome and their families.",
    },
    description: {
      ja: "東京都豊島区の公益財団法人です。寄付は会報の発行、行政への提言、相談、医療の啓発、研究、地域のセミナーに使われます。",
      en: "A public interest foundation in Tokyo. Donations fund newsletters, policy advocacy, counselling, medical awareness, research and local seminars.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://jdss.or.jp/kagayakumirai-kikin/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🌻",
  },
  {
    slug: "gold-ribbon",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "公益財団法人 ゴールドリボン・ネットワーク", en: "Gold Ribbon Network" },
    summary: {
      ja: "小児がんと闘う子どもたちを支えます。",
      en: "Supports children with cancer.",
    },
    description: {
      ja: "東京都豊島区の公益財団法人です。寄付は小児がんの子どもたちと家族への継続した支援に使われます。",
      en: "A public interest foundation in Tokyo. Donations fund ongoing support for children with cancer and their families.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.goldribbon.jp/cheering", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🎗️",
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
  // Added 2026-10-15 after checking each official page that day.
  // ===== OVERSEAS (region: "world") =====

  // verified 2026-10-15: https://www.japanplatform.org/emergency/program/nepal-flash-flood.html
  // Page title is 「ネパール中部土石流災害被災者支援（寄付受付中）」; debris flow of 2026-08-26, donation form + PayPal linked, no end date.
  {
    slug: "jpf-nepal-debris-flow-2026",
    category: "disaster",
    region: "world",
    country: { ja: "ネパール", en: "Nepal" },
    name: { ja: "ジャパン・プラットフォーム（ネパール中部土石流災害被災者支援）", en: "Japan Platform – Central Nepal Debris Flow Response" },
    summary: {
      ja: "2026年8月にネパール中部を襲った大規模土石流の被災者を、加盟NGOを通じて支援します。",
      en: "Supports people hit by the massive August 2026 debris flow in central Nepal through Japan Platform's member NGOs.",
    },
    description: {
      ja: "ジャパン・プラットフォーム（JPF）は、NGO・経済界・政府が連携して緊急人道支援を行う日本の仕組みです。2026年8月26日にネパールと中国チベット自治区の国境付近で発生した土石流で被害を受けたラスワ郡・ヌワコット郡・ダディン郡などで、加盟NGOが行う支援活動に寄付が充てられます。",
      en: "Japan Platform (JPF) is a Japanese partnership of NGOs, business and government that delivers emergency humanitarian aid. Donations fund relief work by its member NGOs in areas such as Rasuwa, Nuwakot and Dhading, hit by the debris flow on the Nepal–Tibet border on 26 August 2026.",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.japanplatform.org/emergency/program/nepal-flash-flood.html", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emergency: { since: "2026-08-26" },
    emoji: "🏔️",
  },

  // verified 2026-10-15: https://www.cwsjapan.org/project/2026_nepal_floods/
  // Page asks for donations for 「ネパール洪水緊急支援」 (floods/debris flows from 2026-08-26, update dated 2026-09-04); donors write 「ネパール洪水」 in the form; no end date.
  {
    slug: "cws-japan-nepal-floods-2026",
    category: "disaster",
    region: "world",
    country: { ja: "ネパール", en: "Nepal" },
    name: { ja: "CWS Japan（ネパール洪水・土石流 緊急支援）", en: "CWS Japan – Nepal Floods and Debris Flows Emergency Response" },
    summary: {
      ja: "ネパール北部の洪水・土石流の被災者に、シェルター資材や食料、水・衛生の支援を届けます。",
      en: "Delivers shelter materials, food, and water and sanitation support to people hit by floods and debris flows in northern Nepal.",
    },
    description: {
      ja: "CWS Japanは、国内外で災害対応と防災支援を行う東京のNPOです。寄付は、2026年8月26日から続くネパール北部の洪水・土石流への緊急支援に充てられ、現地政府やパートナー団体と連携してシェルター資材、食料、水・衛生の支援を行います（寄付フォームの備考欄に「ネパール洪水」と記入してください）。",
      en: "CWS Japan is a Tokyo-based NPO working on disaster response and disaster risk reduction in Japan and abroad. Donations fund its emergency response to the floods and debris flows in northern Nepal that began on 26 August 2026, providing shelter materials, food, and water and sanitation support with the Nepali government and local partners (write \"ネパール洪水\" in the remarks field of the form).",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.cwsjapan.org/project/2026_nepal_floods/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emergency: { since: "2026-08-26" },
    emoji: "🌊",
  },

  // verified 2026-10-15: https://www.jrc.or.jp/contribute/help/2026nepal/
  // Page says 受付期間「2026年９月３日（木）から 2026年11月30日（月）まで」 for the 2026年ネパール洪水救援金.
  {
    slug: "jrc-nepal-floods-2026",
    category: "disaster",
    region: "world",
    country: { ja: "ネパール", en: "Nepal" },
    name: { ja: "日本赤十字社（2026年ネパール洪水救援金）", en: "Japanese Red Cross Society – 2026 Nepal Floods Relief" },
    summary: {
      ja: "ネパール北部の土石流・洪水被害に対する赤十字の救援・復興活動を支える救援金です。",
      en: "A relief fund supporting Red Cross relief and recovery work after the debris flow and floods in northern Nepal.",
    },
    description: {
      ja: "日本赤十字社が2026年9月3日から11月30日まで受け付けている、ネパール向けの海外救援金です。2026年8月26日の大規模土石流で被害を受けたラスワ郡・ヌワコット郡・ダディン郡などで、ネパール赤十字社や国際赤十字の救援・復興活動に充てられます。",
      en: "This is the Japanese Red Cross Society's overseas relief fund for Nepal, open from 3 September to 30 November 2026. It funds relief and recovery work by the Nepal Red Cross Society and the international Red Cross in districts such as Rasuwa, Nuwakot and Dhading, hit by the debris flow of 26 August 2026.",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.jrc.or.jp/contribute/help/2026nepal/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emergency: { since: "2026-08-26" },
    emoji: "⛑️",
  },

  // verified 2026-10-15: https://www.unicef.or.jp/kinkyu/venezuela/
  // Live 「ベネズエラ地震 緊急募金」 page with payment options; quakes of 2026-06-24, situation figures as of 8月3日, no end date.
  {
    slug: "unicef-japan-venezuela-earthquake-2026",
    category: "disaster",
    region: "world",
    country: { ja: "ベネズエラ", en: "Venezuela" },
    name: { ja: "日本ユニセフ協会（ベネズエラ地震 緊急募金）", en: "Japan Committee for UNICEF – Venezuela Earthquake Appeal" },
    summary: {
      ja: "2026年6月のベネズエラ地震で被災した子どもと家族に、安全な水や予防接種、心のケアを届けます。",
      en: "Brings safe water, vaccines and psychosocial care to children and families affected by the June 2026 earthquakes in Venezuela.",
    },
    description: {
      ja: "公益財団法人日本ユニセフ協会は、ユニセフの日本における国内委員会です。2026年6月24日にベネズエラ北西部を襲った2度の強い地震を受け、寄付は浄水剤や予防接種、衛生キット、緊急医療キット、子どもの保護と心のケアなどの支援に充てられます。",
      en: "The Japan Committee for UNICEF is UNICEF's national committee in Japan. After two strong earthquakes struck north-western Venezuela on 24 June 2026, donations fund water-purification tablets, vaccinations, hygiene and emergency medical kits, and child protection and mental-health care.",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.unicef.or.jp/kinkyu/venezuela/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emergency: { since: "2026-06-24" },
    emoji: "🧒",
  },

  // verified 2026-10-15: https://aarjapan.gr.jp/emergency/middle_east_crisis/
  // Listed as 実施中 on AAR's emergency index; page published 2026-03-05, last updated 2026-04-22, active one-time/monthly donate buttons, no closing date.
  {
    slug: "aar-japan-middle-east-crisis-2026",
    category: "disaster",
    region: "world",
    country: { ja: "レバノン", en: "Lebanon" },
    name: { ja: "AAR Japan［難民を助ける会］（中東危機緊急支援）", en: "AAR Japan – Middle East Crisis Emergency Response" },
    summary: {
      ja: "中東危機で避難を強いられたレバノンの人々に、現地パートナーと食料を届けています。",
      en: "Delivers food to people displaced in Lebanon by the Middle East crisis, working with a local partner.",
    },
    description: {
      ja: "AAR Japan［難民を助ける会］は、東京都に認定された認定NPO法人で、国内外で緊急支援を行っています。2026年3月に始めた中東危機緊急支援では、レバノンで現地団体と協力して国内避難民や弱い立場の人々に食料を配付しており、寄付はこうした活動に充てられます。",
      en: "AAR Japan is a certified NPO (certified by the Tokyo Metropolitan Government) providing emergency aid in Japan and abroad. Its Middle East crisis response, launched in March 2026, delivers food with a local partner to internally displaced and vulnerable people in Lebanon, and donations fund this work.",
    },
    ...referral,
    payment: { mode: "external", url: "https://aarjapan.gr.jp/emergency/middle_east_crisis/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
      emoji: "🍞",
  },

  // verified 2026-10-15: https://ccp-ngo.jp/get-involved/donaton/
  // Page offers a 「ガザ緊急」 donation option (Congrant form "パレスチナ・ガザ緊急支援にご協力をお願いします！" is live); latest Gaza update on the site dated 2026-09-18.
  {
    slug: "ccp-japan-gaza-emergency",
    category: "disaster",
    region: "world",
    country: { ja: "パレスチナ（ガザ）", en: "Palestine (Gaza)" },
    name: { ja: "パレスチナ子どものキャンペーン（ガザ緊急支援）", en: "Campaign for the Children of Palestine – Gaza Emergency Appeal" },
    summary: {
      ja: "攻撃が続くガザで、子どもと家族への緊急支援を続けている日本のNGOです。",
      en: "A Japanese NGO continuing emergency aid for children and families in Gaza as attacks go on.",
    },
    description: {
      ja: "認定NPO法人パレスチナ子どものキャンペーンは、パレスチナやレバノンの子どもたちを支援する日本のNGOです。寄付ページでは「ガザ緊急」を選んで寄付でき、子どもの食事や家族の食料・燃料、障がいのある子どもの補助具などの支援に充てられます。",
      en: "The Campaign for the Children of Palestine is a Japanese certified NPO supporting children in Palestine and Lebanon. Its donation page lets you choose \"Gaza emergency\", and gifts fund support such as meals for children, food and fuel for families, and assistive devices for children with disabilities.",
    },
    ...referral,
    payment: { mode: "external", url: "https://ccp-ngo.jp/get-involved/donaton/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🕊️",
  },

  // verified 2026-10-27: https://www.globalgiving.org/projects/nepal-flood-relief-fund/ — donate buttons live, $2.6M of $3M raised; refers to the flash floods of August 26.
  {
    slug: "globalgiving-nepal-flood-relief-fund",
    category: "disaster",
    region: "world",
    country: { ja: "ネパール", en: "Nepal" },
    name: { ja: "GlobalGiving ネパール洪水救援基金", en: "GlobalGiving – Nepal Flood Relief Fund" },
    summary: {
      ja: "2026年8月26日の洪水・土石流の被災地で、現地の団体による救援と復興を支えます。",
      en: "Funds local organisations providing relief and recovery after the flash floods of 26 August 2026.",
    },
    description: {
      ja: "米国の寄付プラットフォーム GlobalGiving が運営する基金です。寄付は現地の団体に配られ、捜索・救助、医療、シェルター、食料、安全な水などの緊急支援と、山間部の長期的な復興に充てられます。海外発行のカードでも寄付できます。",
      en: "A fund run by GlobalGiving, a US giving platform. Gifts are granted to local organisations for search and rescue, medical care, shelter, food and clean water, and later for long-term recovery in remote communities. International cards are accepted.",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.globalgiving.org/projects/nepal-flood-relief-fund/", via: { ja: "GlobalGiving（海外カード対応の寄付サイト）", en: "GlobalGiving (accepts international cards)" } },
    emergency: { since: "2026-08-26" },
    emoji: "🌐",
  },

  // verified 2026-10-27: https://www.globalgiving.org/projects/venezuela-earthquake-relief-fund/ — donate buttons live, $1.27M of $1.5M raised.
  {
    slug: "globalgiving-venezuela-earthquake-fund",
    category: "disaster",
    region: "world",
    country: { ja: "ベネズエラ", en: "Venezuela" },
    name: { ja: "GlobalGiving ベネズエラ地震救援基金", en: "GlobalGiving – Venezuela Earthquake Relief Fund" },
    summary: {
      ja: "ベネズエラ地震の被災地で、現地の団体による医療・シェルター・食料の支援を支えます。",
      en: "Funds local organisations providing medical care, shelter and food after the earthquakes in Venezuela.",
    },
    description: {
      ja: "米国の寄付プラットフォーム GlobalGiving が運営する基金です。寄付は現地の団体に配られ、緊急医療、捜索・救助、仮設シェルター、食料、安全な水、衛生用品と、その後の復旧・再建に充てられます。海外発行のカードでも寄付できます。",
      en: "A fund run by GlobalGiving, a US giving platform. Gifts are granted to local organisations for emergency medical care, search and rescue, temporary shelter, food, clean water and hygiene supplies, and later for recovery and rebuilding. International cards are accepted.",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.globalgiving.org/projects/venezuela-earthquake-relief-fund/", via: { ja: "GlobalGiving（海外カード対応の寄付サイト）", en: "GlobalGiving (accepts international cards)" } },
    emergency: { since: "2026-06-24" },
    emoji: "🌐",
  },

  // verified 2026-10-27: https://www.globalgiving.org/projects/middle-east-crisis-relief-fund/ — donate buttons live, names Gaza and Lebanon.
  {
    slug: "globalgiving-middle-east-crisis-fund",
    category: "disaster",
    region: "world",
    country: { ja: "ガザ・レバノン", en: "Gaza and Lebanon" },
    name: { ja: "GlobalGiving 中東危機救援基金", en: "GlobalGiving – Middle East Crisis Relief Fund" },
    summary: {
      ja: "ガザとレバノンなどで、食料・水・医薬品やシェルター、心のケアを届ける現地の団体を支えます。",
      en: "Funds local groups delivering food, water, medicine, shelter and mental-health support in Gaza, Lebanon and other affected areas.",
    },
    description: {
      ja: "米国の寄付プラットフォーム GlobalGiving が運営する基金です。寄付は現地の団体に配られ、食料・安全な水・医薬品、シェルターと仮設住宅、心のケア、緊急の人道支援と長期的な復興に充てられます。海外発行のカードでも寄付できます。",
      en: "A fund run by GlobalGiving, a US giving platform. Gifts are granted to local organisations for food, clean water and medicine, shelter and temporary housing, psychosocial support, and urgent relief and long-term recovery. International cards are accepted.",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.globalgiving.org/projects/middle-east-crisis-relief-fund/", via: { ja: "GlobalGiving（海外カード対応の寄付サイト）", en: "GlobalGiving (accepts international cards)" } },
    emoji: "🌐",
  },

  // verified 2026-10-27: https://www.globalgiving.org/projects/sudan-emergency-fund/ — donate buttons live.
  {
    slug: "globalgiving-sudan-emergency-fund",
    category: "disaster",
    region: "world",
    country: { ja: "スーダン", en: "Sudan" },
    name: { ja: "GlobalGiving スーダン緊急基金", en: "GlobalGiving – Sudan Emergency Fund" },
    summary: {
      ja: "飢餓と紛争が続くスーダンで、食料・水・医療・避難民の保護を担う現地の団体を支えます。",
      en: "Funds vetted local partners delivering food, water, medical care and protection for displaced people in Sudan.",
    },
    description: {
      ja: "米国の寄付プラットフォーム GlobalGiving が運営する基金です。寄付は審査済みの現地パートナーを通じて、飢餓や危機の影響を受けた地域への食料・水・物資、避難民のシェルターと保護、医療と心のケアに充てられます。海外発行のカードでも寄付できます。",
      en: "A fund run by GlobalGiving, a US giving platform. Gifts go through vetted local partners to deliver food, water and supplies to famine- and crisis-affected communities, shelter and protection for displaced people, and medical and psychosocial care. International cards are accepted.",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.globalgiving.org/projects/sudan-emergency-fund/", via: { ja: "GlobalGiving（海外カード対応の寄付サイト）", en: "GlobalGiving (accepts international cards)" } },
    emoji: "🌐",
  },

  // ===== DOMESTIC (region: "japan") =====

  // verified 2026-10-27: https://www.globalgiving.org/projects/emergency-response-to-kumamoto-earthquake-2026/ — Japan Platform (Chiyoda-ku), donate buttons live, $772 of $200,000.
  {
    slug: "globalgiving-jpf-kumamoto-2026",
    category: "disaster",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "ジャパン・プラットフォーム（熊本地震 海外からの寄付窓口）", en: "Japan Platform – Kumamoto Earthquake 2026 (give from abroad)" },
    summary: {
      ja: "海外発行のカードで、熊本地震の被災者を支援する日本のNGOの活動に寄付できます。",
      en: "Give with an international card to Japanese NGOs helping survivors of the Kumamoto earthquake.",
    },
    description: {
      ja: "ジャパン・プラットフォーム（JPF）が GlobalGiving に開設した、2026年7月28日の熊本地震の緊急支援プロジェクトです。猛暑と避難生活の中での二次被害を防ぐため、女性や高齢者向けの衛生用品、食事、発電機や仮設トイレなどに充てられます。海外にお住まいの方や、海外の友人に寄付を呼びかけるときに向いています。",
      en: "Japan Platform's (JPF) emergency appeal on GlobalGiving for the earthquake of 28 July 2026 in Kumamoto. It funds sanitary products for women and older people, meals, generators, portable toilets and more, to prevent further harm in the heat and in evacuation life. A good option if you live outside Japan or want to invite friends abroad to give.",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.globalgiving.org/projects/emergency-response-to-kumamoto-earthquake-2026/", via: { ja: "GlobalGiving（海外カード対応の寄付サイト）", en: "GlobalGiving (accepts international cards)" } },
    emergency: { since: "2026-07-28" },
    emoji: "🌏",
  },

  // verified 2026-10-27: https://www.globalgiving.org/projects/z2026-kumamoto-earthquake-response/ — Civic Force (Shibuya-ku), project #78486, donate buttons live.
  {
    slug: "globalgiving-civic-force-kumamoto-2026",
    category: "disaster",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "Civic Force（熊本地震 海外からの寄付窓口）", en: "Civic Force – 2026 Kumamoto Earthquake Response (give from abroad)" },
    summary: {
      ja: "海外発行のカードで、熊本地震の避難者に救援物資を届ける活動に寄付できます。",
      en: "Give with an international card to deliver relief supplies to evacuees after the Kumamoto earthquake.",
    },
    description: {
      ja: "公益社団法人Civic Force（東京都渋谷区）が GlobalGiving に開設した、2026年熊本地震の緊急支援プロジェクトです。寄付は避難者への救援物資の配布などの緊急対応に充てられます。海外にお住まいの方や、海外の友人に寄付を呼びかけるときに向いています。",
      en: "Civic Force's (Shibuya, Tokyo) appeal on GlobalGiving for the 2026 Kumamoto earthquake. Gifts fund its emergency response, including relief supplies for evacuees. A good option if you live outside Japan or want to invite friends abroad to give.",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.globalgiving.org/projects/z2026-kumamoto-earthquake-response/", via: { ja: "GlobalGiving（海外カード対応の寄付サイト）", en: "GlobalGiving (accepts international cards)" } },
    emergency: { since: "2026-07-28" },
    emoji: "🌏",
  },

  // verified 2026-10-15: https://aarjapan.gr.jp/emergency/kumamoto_eq/
  // Page 「2026年9月9日更新」, listed under 現在実施中の緊急支援, active 寄付する button, no closing date.
  {
    slug: "aar-japan-kumamoto-earthquake-2026",
    category: "disaster",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "AAR Japan［難民を助ける会］（熊本地震緊急支援）", en: "AAR Japan – Kumamoto Earthquake Emergency Response" },
    summary: {
      ja: "2026年熊本地震の被災地で、炊き出しや物資配付、障がい者支援施設への支援を行っています。",
      en: "Runs hot-meal services, supply distribution and support for a disability centre in areas hit by the 2026 Kumamoto earthquake.",
    },
    description: {
      ja: "AAR Japan［難民を助ける会］は、東京都に認定された認定NPO法人で、国内外の災害で緊急支援を行っています。2026年7月28日の熊本地震では、炊き出し、物資配付、仮設シャワー、外国人住民向けの支援物資拠点、八代市の障がい者支援施設への支援などを行っており、寄付はこうした活動に充てられます。",
      en: "AAR Japan is a certified NPO (certified by the Tokyo Metropolitan Government) providing emergency aid in disasters in Japan and abroad. After the Kumamoto earthquake of 28 July 2026 it has run hot-meal services, supply distribution, temporary showers, a relief point for foreign residents and support for a disability centre in Yatsushiro, and donations fund this work.",
    },
    ...referral,
    payment: { mode: "external", url: "https://aarjapan.gr.jp/emergency/kumamoto_eq/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emergency: { since: "2026-07-28" },
    emoji: "🍙",
  },

  // verified 2026-10-15: https://lp.peace-winds.org/support_kumamoto_earthquake/
  // Live one-time donation and ARROWSサポーター options; journal entry ~2 months after the quake says shelter operation in 氷川町 continues since September; no closing date.
  {
    slug: "peace-winds-arrows-kumamoto-2026",
    category: "disaster",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "空飛ぶ捜索医療団ARROWS／ピースウィンズ・ジャパン（熊本地震支援）", en: "ARROWS / Peace Winds Japan – Kumamoto Earthquake Response" },
    summary: {
      ja: "熊本地震の発生直後から、医療・物資・避難所運営などで被災者を支え続けています。",
      en: "Has supported earthquake survivors in Kumamoto with medical care, supplies and shelter management since just after the quake.",
    },
    description: {
      ja: "ピースウィンズ・ジャパンは広島県に本部を置く認定NPO法人で、空飛ぶ捜索医療団ARROWSを運営しています。2026年熊本地震では医療、物資配付、捜索、避難所運営（9月からは県の委託で氷川町の避難所を運営）を行っており、寄付は在宅避難者や仮設住宅へ移る世帯の支援を含む緊急対応と復興支援に充てられます。",
      en: "Peace Winds Japan is a certified NPO headquartered in Hiroshima Prefecture that runs the ARROWS search-and-medical team. In the 2026 Kumamoto earthquake it has provided medical care, supply distribution, rescue and shelter management (running a shelter in Hikawa Town for the prefecture since September), and donations fund this emergency and recovery work, including help for people sheltering at home and households moving into temporary housing.",
    },
    ...referral,
    payment: { mode: "external", url: "https://lp.peace-winds.org/support_kumamoto_earthquake/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emergency: { since: "2026-07-28" },
    emoji: "🚁",
  },

  // verified 2026-10-15: https://www.japanheart.org/topics/support/20260728_kumamoto_earthquake.html
  // Page marked 「寄付・募金受付中」 for 令和8年熊本地震緊急支援, 8月27日更新; may close without notice.
  {
    slug: "japan-heart-kumamoto-earthquake-2026",
    category: "disaster",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "ジャパンハート（令和8年熊本地震緊急支援）", en: "Japan Heart – 2026 Kumamoto Earthquake Emergency Relief" },
    summary: {
      ja: "熊本地震の被災地に医療チームを派遣し、医療支援を行っています。",
      en: "Sends medical teams to provide healthcare in areas hit by the Kumamoto earthquake.",
    },
    description: {
      ja: "ジャパンハートは国内外で医療支援を行う認定NPO法人で、地震翌日の7月29日には八代市に医療チームが到着しました。寄付は医薬品や救援活動の費用、医療者・調整員の派遣にかかる交通費などに充てられます。",
      en: "Japan Heart is a certified NPO providing medical aid in Japan and abroad; its medical team reached Yatsushiro on 29 July, the day after the quake. Donations fund medical supplies, relief activities and travel costs for deploying doctors, nurses and coordinators.",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.japanheart.org/topics/support/20260728_kumamoto_earthquake.html", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emergency: { since: "2026-07-28" },
    emoji: "🩺",
  },

  // verified 2026-10-15: https://www.worldvision.jp/donate/r8-kumamoto-earthquake/index.html
  // Active 「熊本地震緊急支援募金」 donation buttons, latest news item dated 2026-08-27, no end date.
  {
    slug: "world-vision-japan-kumamoto-2026",
    category: "disaster",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "ワールド・ビジョン・ジャパン（熊本地震緊急支援募金）", en: "World Vision Japan – Kumamoto Earthquake Emergency Appeal" },
    summary: {
      ja: "熊本地震の被災地で、子どもの居場所づくりや子どもの施設への支援を行っています。",
      en: "Supports children in quake-hit Kumamoto with safe spaces and help for children's facilities.",
    },
    description: {
      ja: "ワールド・ビジョン・ジャパンは、子どもの支援に取り組む国際NGOです。2026年熊本地震では、美里町の公民館での「子どもの居場所」運営、30人の子どもが暮らす施設への飲料水の提供、子どもの安全な環境づくりのためのスタッフ派遣などに寄付が充てられます。",
      en: "World Vision Japan is an international NGO focused on children. In the 2026 Kumamoto earthquake, donations fund a children's space at a community centre in Misato Town, emergency drinking water for a children's facility caring for 30 children, and staff deployed to keep children safe.",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.worldvision.jp/donate/r8-kumamoto-earthquake/index.html", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emergency: { since: "2026-07-28" },
    emoji: "🧸",
  },

  // verified 2026-10-15: https://www.savechildren.or.jp/lp/kumamotoearthquake2026/
  // Accepting card/form/postal donations (memo 「熊本地震」); latest update dated 2026-09-16 (school supplies in 八代市); no closing date.
  {
    slug: "save-the-children-japan-kumamoto-2026",
    category: "disaster",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "セーブ・ザ・チルドレン・ジャパン（2026年熊本地震 緊急子ども支援）", en: "Save the Children Japan – 2026 Kumamoto Earthquake Children's Emergency Response" },
    summary: {
      ja: "熊本地震で被災した子どもたちに、心のケアや学びの支援、学用品などを届けています。",
      en: "Provides psychological first aid, learning support and school supplies for children affected by the Kumamoto earthquake.",
    },
    description: {
      ja: "公益社団法人セーブ・ザ・チルドレン・ジャパンは、子ども支援を専門とする国際NGOです。2026年熊本地震では、子どものための心理的応急処置の情報提供、子どもや子ども関連施設への物資・備品の提供、学びの支援などを行っており、9月には八代市で学用品や学校備品の支援を行いました。",
      en: "Save the Children Japan is a public interest incorporated association and international NGO dedicated to children. In the 2026 Kumamoto earthquake it provides psychological first aid information for children, supplies and equipment for children and children's facilities, and learning support, including school supplies and equipment in Yatsushiro in September.",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.savechildren.or.jp/lp/kumamotoearthquake2026/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emergency: { since: "2026-07-28" },
    emoji: "🎒",
  },

  // verified 2026-10-15: https://www.pref.chiba.lg.jp/bousaik/press/2026/r8-chibagouu-gienkin.html
  // Page says 「募集期間は令和9年3月31日(水曜日)までとします。」 for 令和8年8月千葉豪雨及び台風第25号 千葉県災害義援金 (bank transfer only).
  {
    slug: "chiba-prefecture-rain-typhoon-2026",
    category: "municipality",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "千葉県（令和8年8月千葉豪雨及び台風第25号 災害義援金）", en: "Chiba Prefecture – August 2026 Heavy Rain and Typhoon No. 25 Relief Donations" },
    summary: {
      ja: "8月の豪雨と台風第25号で被害を受けた千葉県内の被災者に、義援金として全額届けられます。",
      en: "Relief donations passed on to people in Chiba Prefecture affected by the August heavy rain and Typhoon No. 25.",
    },
    description: {
      ja: "千葉県が、令和8年8月の千葉豪雨と9月の台風第25号の被災者のために一本化して募集している義援金で、受付は令和9年3月31日までです。義援金は配分委員会が配分を決め、被災市町村を通じて被災世帯に届けられます（寄付は銀行振込で、ページに口座が掲載されています）。",
      en: "Chiba Prefecture runs this combined relief fund for victims of the August 2026 Chiba heavy rain and September's Typhoon No. 25, open until 31 March 2027. A distribution committee allocates the money, which reaches affected households through their municipalities (donations are by bank transfer to the accounts listed on the page).",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.pref.chiba.lg.jp/bousaik/press/2026/r8-chibagouu-gienkin.html", via: { ja: "自治体の公式寄附ページ", en: "the municipality's official donation page" } },
    emergency: { since: "2026-08-19" },
    emoji: "☔",
  },

  // verified 2026-10-15: https://www.pref.kanagawa.jp/docs/ga4/saigaigien/r8typhoon25gouboshuu.html
  // Page gives 募集期間 2026年10月8日（木）〜2027年3月31日（水） for 令和8年台風第25号災害義援金 (bank transfer).
  {
    slug: "kanagawa-prefecture-typhoon-25-2026",
    category: "municipality",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "神奈川県（令和8年台風第25号災害義援金）", en: "Kanagawa Prefecture – 2026 Typhoon No. 25 Relief Donations" },
    summary: {
      ja: "2026年9月の台風第25号で被害を受けた神奈川県内の方々に、義援金として届けられます。",
      en: "Relief donations for people in Kanagawa Prefecture affected by Typhoon No. 25 in September 2026.",
    },
    description: {
      ja: "神奈川県が2026年10月8日から2027年3月31日まで募集している、台風第25号の災害義援金です。日本赤十字社神奈川県支部や神奈川県共同募金会に寄せられた分と合わせ、県の配分委員会が市町村ごとの配分を決め、市町村から被災者に届けられます（寄付は銀行振込で、ページに口座が掲載されています）。",
      en: "Kanagawa Prefecture collects these Typhoon No. 25 relief donations from 8 October 2026 to 31 March 2027. Together with money given to the Red Cross Kanagawa branch and the Kanagawa Community Chest, the prefecture's distribution committee sets each municipality's share, and municipalities pass it to those affected (donations are by bank transfer to the accounts listed on the page).",
    },
    ...referral,
    payment: { mode: "external", url: "https://www.pref.kanagawa.jp/docs/ga4/saigaigien/r8typhoon25gouboshuu.html", via: { ja: "自治体の公式寄附ページ", en: "the municipality's official donation page" } },
    emergency: { since: "2026-10-08" },
    emoji: "🌀",
  },

  // verified 2026-10-15: https://akaihane-ishikawa.or.jp/info/%e7%9f%b3%e5%b7%9d%e7%9c%8c%e4%bb%a4%e5%92%8c%ef%bc%98%e5%b9%b4%ef%bc%98%e6%9c%88%e5%a4%a7%e9%9b%a8%e7%81%bd%e5%ae%b3%e7%be%a9%e6%8f%b4%e9%87%91%e3%81%ae%e5%8b%9f%e9%9b%86%e3%81%ab%e3%81%a4%e3%81%84/
  // Page says 受付期間「令和８年８月３１日（月）から令和９年１月２９日（金）まで」, last updated 2026-10-09.
  {
    slug: "akaihane-ishikawa-august-rain-2026",
    category: "disaster",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "石川県共同募金会（石川県令和8年8月大雨災害義援金）", en: "Ishikawa Community Chest – August 2026 Heavy Rain Relief Donations" },
    summary: {
      ja: "2026年8月の大雨で被災した石川県内の方々に、市町を通じて義援金を届けます。",
      en: "Relief donations reaching people in Ishikawa Prefecture affected by the August 2026 heavy rain, via their municipalities.",
    },
    description: {
      ja: "石川県共同募金会（赤い羽根）が、令和8年8月の大雨災害の義援金を令和9年1月29日まで受け付けています（状況により延長の場合があります）。関係機関でつくる石川県災害義援金配分委員会が配分基準を決め、市町を通じて被災者に届けられます。",
      en: "The Ishikawa Community Chest (Red Feather) is accepting relief donations for the August 2026 heavy rain until 29 January 2027, possibly extended depending on the situation. The prefecture's disaster donation distribution committee sets the allocation, and the money reaches survivors through their municipalities.",
    },
    ...referral,
    payment: { mode: "external", url: "https://akaihane-ishikawa.or.jp/info/%e7%9f%b3%e5%b7%9d%e7%9c%8c%e4%bb%a4%e5%92%8c%ef%bc%98%e5%b9%b4%ef%bc%98%e6%9c%88%e5%a4%a7%e9%9b%a8%e7%81%bd%e5%ae%b3%e7%be%a9%e6%8f%b4%e9%87%91%e3%81%ae%e5%8b%9f%e9%9b%86%e3%81%ab%e3%81%a4%e3%81%84/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emergency: { since: "2026-08-27" },
    emoji: "🪶",
  },

  // verified 2026-10-15: https://akaihane-fukui.jp/88.html
  // Page says 受付期間「令和8年9月3日（木）から 令和8年11月30日（月）まで」 for 令和8年8月大雨福井県災害義援金.
  {
    slug: "akaihane-fukui-august-rain-2026",
    category: "disaster",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "福井県共同募金会（令和8年8月大雨福井県災害義援金）", en: "Fukui Community Chest – August 2026 Heavy Rain Relief Donations" },
    summary: {
      ja: "2026年8月の大雨で被災した福井県内の方々に、市町を通じて義援金を届けます。",
      en: "Relief donations reaching people in Fukui Prefecture affected by the August 2026 heavy rain, via their municipalities.",
    },
    description: {
      ja: "社会福祉法人福井県共同募金会が、令和8年8月の大雨災害の義援金を令和8年11月30日まで受け付けています。福井県や共同募金会などでつくる災害義援金配分委員会がとりまとめ、被災地の市町を通じて被災者に届けられます（寄付は銀行振込などで、ページに口座が掲載されています）。",
      en: "The Fukui Community Chest, a social welfare corporation, is accepting relief donations for the August 2026 heavy rain until 30 November 2026. A distribution committee including Fukui Prefecture and the Community Chest pools the money, which reaches survivors through the affected municipalities (donations are by bank transfer and other methods listed on the page).",
    },
    ...referral,
    payment: { mode: "external", url: "https://akaihane-fukui.jp/88.html", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emergency: { since: "2026-08-27" },
    emoji: "🪶",
  },
  // Welfare organisations added 2026-10-15 after checking each official page that day.
  // theme: children
  // verified 2026-10-15: https://www.sosjapan.org/support/donation — one-time (any amount) and monthly credit-card giving via ROBOT PAYMENT, page says gifts to this 認定NPO法人 get tax benefits; home page news dated up to 2026-09-28 (new site "あかり" opened 2026-08-19)
  {
    slug: "sos-childrens-villages-japan",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "認定NPO法人 SOS子どもの村JAPAN", en: "SOS Children's Villages Japan" },
    summary: {
      ja: "家族と離れて暮らす子どもが家庭的な環境で育つよう支えます。",
      en: "Helps children who cannot live with their families grow up in a family-like home.",
    },
    description: {
      ja: "福岡市を拠点とする認定NPO法人で、「子どもの村福岡」の運営や里親支援、ヤングケアラーの相談などを行っています。寄付は使途を限定せず、家族と離れて暮らす子どもや困難を抱える家庭への支援全体に使われます。",
      en: "A certified NPO based in Fukuoka City that runs Children's Village Fukuoka, supports foster families and offers advice to young carers. Donations are unrestricted and fund its work with children living apart from their families and families in difficulty.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.sosjapan.org/support/donation", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🏡",
  },
  // theme: children
  // verified 2026-10-15: https://asuiku.org/donation — monthly and one-time Congrant donation forms linked; page lists uses (food bank "プラアス", 多賀城こども食堂, nature facility, 子ども第三の居場所); site news dated up to 2026-10-15; no tax-deduction mention (NPO法人)
  {
    slug: "asuiku",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "NPO法人 アスイク", en: "Asuiku" },
    summary: {
      ja: "宮城県で困難を抱える子どもや若者の食と居場所を支えます。",
      en: "Food support and safe places for children and young people in difficulty in Miyagi.",
    },
    description: {
      ja: "仙台市のNPO法人で、子どもの学習・生活支援や不登校・ヤングケアラー支援、食支援などを行っています。寄付はフードバンク「プラアス」の配送、多賀城こども食堂、自然体験施設、子ども第三の居場所の運営などに使われます。",
      en: "An NPO in Sendai offering learning and daily-life support, help for children out of school and young carers, and food support. Donations fund deliveries by its Pura-Asu food bank, the Tagajo children's cafeteria, a nature-experience facility and a third place for children.",
    },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://asuiku.org/donation", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🍙",
  },
  // theme: children (難病の子ども)
  // verified 2026-10-15: https://www.solaputi.jp/aid/donation/ — card form (Congrant), PayPal, PayPay, Syncable; 特定公益増進法人 so gifts get income/resident-tax benefits; page modified 2026-01-29, site news to 2026-10-14
  {
    slug: "solaputi-kids-camp",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "公益財団法人 そらぷちキッズキャンプ", en: "Solaputi Kids' Camp" },
    summary: {
      ja: "難病とたたかう子どものための医療ケア付きキャンプ場を運営します。",
      en: "Runs a camp with medical care for children fighting serious illness.",
    },
    description: {
      ja: "北海道滝川市にある、難病の子どもと家族のための医療ケア付きキャンプ場を運営する公益財団法人です。寄付は医療体制の整備、施設の維持・運営、子どもたちの滞在費に使われます。",
      en: "A public-interest foundation running a camp with medical care in Takikawa, Hokkaido, for seriously ill children and their families. Donations pay for medical staffing, upkeep of the site and the children's stays.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.solaputi.jp/aid/donation/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🏕️",
  },
  // theme: children (難病の子ども)
  // verified 2026-10-15: https://www.dmhcj.or.jp/support/ — one-time/monthly/annual card forms (dmhcj.my.salesforce-sites.com); page says donations are tax-deductible; 12 houses run entirely on donations; site news to 2026-10-05
  {
    slug: "ronald-mcdonald-house-japan",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "公益財団法人 ロナルド・マクドナルド・ハウス・ジャパン", en: "Ronald McDonald House Japan" },
    summary: {
      ja: "病気の子どもに付き添う家族が病院の近くに滞在できるハウスを運営します。",
      en: "Runs houses near hospitals where families of children in treatment can stay.",
    },
    description: {
      ja: "全国12か所で、入院中の子どもの家族が滞在できるハウスを病院の近くに運営する公益財団法人です。ハウスの運営はすべて寄付と支援で賄われ、家族の身体的・精神的・経済的な負担を軽くします。",
      en: "A public-interest foundation running 12 houses beside hospitals across Japan where families of children in hospital can stay. The houses run entirely on donations, easing families' physical, emotional and financial burden.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.dmhcj.or.jp/support/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🏠",
  },
  // theme: care (医療的ケア児)
  // verified 2026-10-15: https://congrant.com/project/unleashkihu/24021 — Congrant page linked as 「寄付で応援する」 from unleash.or.jp; "寄付をする" button live, recruiting 50 monthly partners for the 2026 CareCareer project; no tax-deduction mention (NPO法人); site posts to 2026-09-18
  {
    slug: "unleash",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "NPO法人 アンリーシュ", en: "Unleash" },
    summary: {
      ja: "医療的ケアが必要な子どもを育てる家族の孤立と不安を減らします。",
      en: "Reduces isolation and worry for families raising children who need medical care.",
    },
    description: {
      ja: "東京都中央区のNPO法人で、医療的ケア児の家族向けの情報発信やオンラインのピアサポート、在宅就労支援を行っています。寄付は家族の就労を支える「CareCareer」の相談やピアサポートを継続し、全国の家族に届けるために使われます。",
      en: "An NPO in Chuo, Tokyo, offering information, online peer support and work-from-home help to families of children with medical care needs. Donations keep its CareCareer advice and peer support running and help it reach families nationwide.",
    },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://congrant.com/project/unleashkihu/24021", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🩺",
  },
  // theme: children (不登校・困難を抱える10代)
  // verified 2026-10-15: https://www.katariba.or.jp/donate/monthly_now/ — monthly and one-time buttons lead to a live card form (VISA/Master/JCB/Amex/Diners, also Amazon Pay, bank); 認定NPO, page says gifts get tax benefits; financial report labelled 2025年度8月期
  {
    slug: "katariba",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "認定NPO法人 カタリバ", en: "Katariba" },
    summary: {
      ja: "不登校や貧困など困難を抱える10代に居場所と学びの機会を届けます。",
      en: "Safe places and learning for teenagers facing school non-attendance, poverty and other hardships.",
    },
    description: {
      ja: "東京都中野区の認定NPO法人で、貧困や不登校、ヤングケアラーなど困難を抱える10代を支えています。寄付は手作りの食事や学習教材、放課後の教室の運営など、子どもたちへの支援に使われます。",
      en: "A certified NPO in Nakano, Tokyo, supporting teenagers affected by poverty, school non-attendance or caring for family. Donations pay for home-cooked meals, learning materials and after-school classrooms.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.katariba.or.jp/donate/monthly_now/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🎒",
  },
  // theme: children (若者・ひきこもり)
  // verified 2026-10-15: https://www.sodateage.net/donation/ — monthly and one-time forms on kifukara.jp (card or bank debit); 認定NPO with tax benefits; site news to 2026-09-11
  {
    slug: "sodateage-net",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "認定NPO法人 育て上げネット", en: "Sodateage Net" },
    summary: {
      ja: "ひきこもりや無業の若者が働き、自立するまでを支えます。",
      en: "Helps socially isolated and out-of-work young people into work and independence.",
    },
    description: {
      ja: "東京都立川市などに拠点を持つ認定NPO法人で、ひきこもりや無業の若者の就労訓練や家族相談を行っています。寄付は若者への直接の支援と、それを支える運営に使われます。",
      en: "A certified NPO with bases in Tachikawa, Tokyo and elsewhere, offering job training and family advice for isolated and out-of-work young people. Donations fund direct support for young people and the work behind it.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.sodateage.net/donation/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🌱",
  },
  // theme: children (ひとり親)
  // verified 2026-10-15: https://www.single-mama.com/donation/ — credit-card buttons for monthly (1,000-30,000円) and one-time gifts; page states 認定 status lapsed 2023-11-30 so gifts are NOT tax-deductible; site news to 2026-10-14
  {
    slug: "single-mothers-forum",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "NPO法人 しんぐるまざあず・ふぉーらむ", en: "Single Mothers' Forum" },
    summary: {
      ja: "ひとり親のお母さんと子どもの暮らしを支えます。",
      en: "Supports single mothers and their children.",
    },
    description: {
      ja: "東京を拠点に、ひとり親家庭への相談、就労支援、食料支援などを行うNPO法人です。寄付は物価高に苦しむ家庭へのお米や食品の支援、親子のイベント、入学お祝い（ランドセル・入学金のお祝い）に使われます。",
      en: "A Tokyo-based NPO offering advice, job support and food aid to single-parent families. Donations fund rice and food for families hit by rising prices, parent-and-child outings and gifts for children starting school.",
    },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://www.single-mama.com/donation/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "👩‍👧",
  },
  // theme: disability (被災地の障害者支援)
  // verified 2026-10-15: https://yumekazek.com/donation/ — one-time/monthly/annual "寄付する" card buttons (Visa/Master via アナザーレーン); page says gifts are 寄付金控除の対象; page modified 2026-08-15; 2026-08-01 appeal for 令和8年熊本地震
  {
    slug: "yumekaze-kikin",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "認定NPO法人 ゆめ風基金", en: "Yumekaze Fund" },
    summary: {
      ja: "災害で被災した障害のある人に救援金を届けます。",
      en: "Sends relief money to disabled people hit by disasters.",
    },
    description: {
      ja: "阪神・淡路大震災をきっかけに生まれた大阪市の認定NPO法人で、全国の障害者団体と連携して被災した障害者を支援しています。寄付は被災した障害者への救援金として使われ、備考欄で特定の災害を指定することもできます。",
      en: "A certified NPO in Osaka, founded after the 1995 Kobe earthquake, that works with disability groups nationwide to support disabled people affected by disasters. Donations go to relief for disabled survivors, and donors can name a specific disaster.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://yumekazek.com/donation/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🌬️",
  },
  // theme: disability
  // verified 2026-10-15: https://www.moudouken.net/support/kojin/donation/ — online credit-card (3D Secure), PayPay and postal-transfer forms; /support/kojin/ says gifts to this 公益財団法人 get tax benefits; home news to 2026-10-06
  {
    slug: "japan-guide-dog-association",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "公益財団法人 日本盲導犬協会", en: "Japan Guide Dog Association" },
    summary: {
      ja: "盲導犬を育て、目の見えない・見えにくい人の暮らしを支えます。",
      en: "Trains guide dogs and supports people who are blind or partially sighted.",
    },
    description: {
      ja: "仙台・神奈川・島根などに訓練センターを持つ公益財団法人です。寄付は盲導犬の繁殖と健康管理、訓練、視覚障害のある人への歩行や生活の訓練、啓発活動に使われます。",
      en: "A public-interest foundation with training centres in Sendai, Kanagawa, Shimane and elsewhere. Donations fund breeding and care of the dogs, guide-dog training, mobility and daily-living training for people with sight loss, and awareness work.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.moudouken.net/support/kojin/donation/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🦮",
  },
  // theme: elderly
  // verified 2026-10-15: https://www.sawayakazaidan.or.jp/partner/ — on-page card forms for general (from 1,000円) and designated donations plus membership buttons; page says gifts are income/corporate-tax deductible; home news to 2026-10-09
  {
    slug: "sawayaka-welfare-foundation",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "公益財団法人 さわやか福祉財団", en: "Sawayaka Welfare Foundation" },
    summary: {
      ja: "高齢になっても住み慣れた地域で暮らせるよう、地域の助け合いを広げます。",
      en: "Builds local mutual aid so people can live at home with dignity into old age.",
    },
    description: {
      ja: "東京都港区の公益財団法人で、全国で地域の助け合いグループの立ち上げや「地域助け合い基金」による助成を行っています。寄付は地域の助け合い活動と仕組みづくりの支援など、財団の活動全般に使われます。",
      en: "A public-interest foundation in Minato, Tokyo, that helps set up local mutual-aid groups across Japan and makes grants through its Community Mutual-Aid Fund. Donations support its work, including local mutual-aid activities and the systems behind them.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.sawayakazaidan.or.jp/partner/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🤝",
  },
  // theme: food
  // verified 2026-10-15: https://fbyamaguchi.org/support_fby/donation/ — 「コングラントから寄付する」 buttons to a live Congrant form (one-time/monthly/yearly); no tax-deduction mention (NPO法人); site posts dated 2026-10-02 to 2026-10-15
  {
    slug: "foodbank-yamaguchi",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "NPO法人 フードバンク山口", en: "Food Bank Yamaguchi" },
    summary: {
      ja: "余った食品を集め、山口県内で食に困る人や家庭に届けます。",
      en: "Collects surplus food and gets it to people and families in need in Yamaguchi.",
    },
    description: {
      ja: "山口市のNPO法人で、県内各地でフードドライブを開き、集めた食品を必要とする人に届けています。寄付は食品を保管する倉庫や光熱費、集荷・配送費など、活動の運営に使われます。",
      en: "An NPO in Yamaguchi City that runs food drives around the prefecture and passes the food to people who need it. Donations pay for the warehouse and utilities, collection and delivery, and day-to-day running.",
    },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://fbyamaguchi.org/support_fby/donation/", via: { ja: "団体の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🥫",
  },
  // Added 2026-10-15 (Masa: Chiba floods first). Verified on the official pages that day.
  // verified 2026-10-15: https://www.city.chiba.jp/hokenfukushi/kenkofukushi/chiikifukushi/r8chibagouugiennkin.html
  // Page says 受付期間 令和8年8月21日～11月30日, distributed directly to affected residents; updated 2026-10-13.
  {
    slug: "chiba-city-2026-flood-gienkin",
    category: "municipality",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "千葉県千葉市 令和8年8月千葉豪雨・台風第25号等 被災者支援義援金", en: "Chiba City: August 2026 Heavy Rain and Typhoon No. 25 Relief Fund" },
    summary: {
      ja: "千葉市で被災した方々へ、義援金として直接配分されます。",
      en: "Relief money distributed directly to affected residents of Chiba City.",
    },
    description: {
      ja: "千葉市が受け付けている義援金で、被害の確認と配分基準の決定のあと、被災した方々へ直接配分されます。受付は2026年11月30日までで、銀行・ゆうちょ振込か市役所・区役所の募金箱で寄付できます。市のページには寄附金控除の対象になる場合があると書かれています。",
      en: "Collected by Chiba City and paid directly to affected residents once damage is assessed. Open until 30 November 2026, by bank or postal transfer or at donation boxes in city and ward offices. The city says gifts may be tax-deductible.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.city.chiba.jp/hokenfukushi/kenkofukushi/chiikifukushi/r8chibagouugiennkin.html", via: { ja: "自治体の公式寄附ページ", en: "the municipality's official donation page" } },
    emergency: { since: "2026-08-21" },
    emoji: "🏙️",
  },
  // verified 2026-10-15: https://www.jrc.or.jp/contribute/help/20260821/
  // Page says 受付期間 2026年8月21日～2027年3月31日; funds go to Chiba Prefecture's 義援金配分委員会; bank/postal only.
  {
    slug: "jrc-2026-chiba-flood",
    category: "disaster",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "日本赤十字社 令和8年8月千葉豪雨災害義援金", en: "Japanese Red Cross: August 2026 Chiba Heavy Rain Relief Fund" },
    summary: {
      ja: "義援金は千葉県の義援金配分委員会へ送られ、被災した方々に届けられます。",
      en: "Relief money sent to Chiba Prefecture's distribution committee for affected residents.",
    },
    description: {
      ja: "日本赤十字社が受け付けている千葉豪雨の義援金です。受付は2027年3月31日までで、ゆうちょ・銀行振込で寄付できます（クレジットカードは使えません）。振込の控えが寄附金控除の領収書として使えると書かれています。",
      en: "Relief money for the Chiba heavy rain collected by the Japanese Red Cross, open until 31 March 2027 by postal or bank transfer (no credit cards). Transfer slips can be used as receipts for tax deduction.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.jrc.or.jp/contribute/help/20260821/", via: { ja: "日本赤十字社の義援金窓口", en: "the Japanese Red Cross relief fund page" } },
    emergency: { since: "2026-08-21" },
    emoji: "🤝",
  },
  // 児童養護施設 nationwide (Masa, 2026-10-15). Each donation page was opened on 2026-10-15.
  // pref: 北海道
  // verified 2026-10-15: https://iwanaikouseien.jp/pages/36/ — bank transfer (北海道銀行岩内支店) or 現金書留, receipts mailed, page states donations are tax-deductible; latest news 2026-10-05
  {
    slug: "iwanai-kouseien-hokkaido",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人岩内厚生園 児童養護施設岩内厚生園（北海道岩内郡岩内町）", en: "Iwanai Kouseien Children's Home (Iwanai, Hokkaido)" },
    summary: { ja: "北海道岩内町の児童養護施設で暮らす子どもたちを、寄付で支えることができます。", en: "Support the children living at a children's home in Iwanai, Hokkaido, with a donation." },
    description: { ja: "北海道岩内町にある社会福祉法人岩内厚生園が運営する児童養護施設です。寄付金は子どもたちがより安心・安全・快適に過ごすために使われます。", en: "A children's home in Iwanai, Hokkaido, run by the social welfare corporation Iwanai Kouseien. Donations are used to help the children live more safely, securely and comfortably." },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://iwanaikouseien.jp/pages/36/", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🏔️",
  },
  // pref: 北海道
  // verified 2026-10-15: https://kurumi.koseiin.or.jp/donation/ — bank transfer (北洋銀行), 寄附金受領証明書 on request, 育英基金 for leavers' further education; latest news 2026-10-06
  {
    slug: "kurumi-gakuen-hakodate",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人函館厚生院 児童養護施設くるみ学園（北海道函館市）", en: "Kurumi Gakuen Children's Home (Hakodate, Hokkaido)" },
    summary: { ja: "函館の児童養護施設の子どもたちの暮らしと、退所後の進学を寄付で応援できます。", en: "Help children at a Hakodate children's home with daily life and further study after they leave care." },
    description: { ja: "北海道函館市で1歳から18歳までの子どもたちが暮らす、社会福祉法人函館厚生院の児童養護施設です。寄付金は退所後に進学を希望する子どもを支える育英基金や、生活環境の改善・施設運営に使われます。", en: "A children's home in Hakodate, Hokkaido, run by Hakodate Koseiin for children aged 1 to 18. Donations go to a scholarship fund for young people who want to continue their studies after leaving care, and to improving living conditions and running the home." },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://kurumi.koseiin.or.jp/donation/", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🌰",
  },
  // pref: 青森県
  // verified 2026-10-15: https://fujiseiboen.or.jp/藤聖母園-法人本部/ご支援のお願い/ — 郵便振替 02330-2-10252 / bank 当座, fee-free slip on request, cites 所得税法78条 tax treatment; latest news 2026-10-09
  {
    slug: "fuji-seiboen-aomori",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人藤聖母園 児童養護施設藤聖母園（青森県青森市）", en: "Fuji Seiboen Children's Home (Aomori City, Aomori)" },
    summary: { ja: "青森市で児童養護施設などを運営する社会福祉法人藤聖母園を寄付で支えられます。", en: "Support Fuji Seiboen, an Aomori social welfare corporation that runs a children's home, with a donation." },
    description: { ja: "青森市で児童養護施設藤聖母園や乳児院、こども園などを運営する社会福祉法人です。寄付金は法人と各施設・事業所の運営に活用されます。", en: "A social welfare corporation in Aomori City that runs the Fuji Seiboen children's home along with an infant home, nursery schools and other services. Donations are used to run the corporation and its facilities." },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://fujiseiboen.or.jp/%E8%97%A4%E8%81%96%E6%AF%8D%E5%9C%92-%E6%B3%95%E4%BA%BA%E6%9C%AC%E9%83%A8/%E3%81%94%E6%94%AF%E6%8F%B4%E3%81%AE%E3%81%8A%E9%A1%98%E3%81%84/", via: { ja: "法人の公式寄付ページ", en: "the corporation's official donation page" } },
    emoji: "🍎",
  },
  // pref: 岩手県
  // verified 2026-10-15: https://seikougakuen.jp/donation/ — bank transfer (岩手銀行石鳥谷支店) / 現金書留 + downloadable form, receipt for 寄附金控除; latest news 2026-10-03
  {
    slug: "seikou-gakuen-iwate",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人青松会 児童養護施設清光学園（岩手県花巻市）", en: "Seikou Gakuen Children's Home (Hanamaki, Iwate)" },
    summary: { ja: "岩手県花巻市の児童養護施設で暮らす子どもたちを寄付で応援できます。", en: "Support the children living at a children's home in Hanamaki, Iwate, with a donation." },
    description: { ja: "岩手県花巻市石鳥谷町にある社会福祉法人青松会の児童養護施設です。寄付金は子どもたちのために大切に使われ、領収書は確定申告の寄附金控除に使えます。", en: "A children's home in Ishidoriya, Hanamaki, Iwate, run by the social welfare corporation Seishokai. Donations are used for the children, and the receipt can be used to claim the donation deduction on a tax return." },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://seikougakuen.jp/donation/", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🌾",
  },
  // pref: 宮城県
  // verified 2026-10-15: http://sayurien.com/support.html — donation application form, tax credit formula stated, funds for children/rebuilding; latest news 2026-10-09 (rebuild tender result)
  {
    slug: "sayurien-sendai",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人善き牧者会 児童養護施設小百合園（宮城県仙台市）", en: "Sayurien Children's Home (Sendai, Miyagi)" },
    summary: { ja: "仙台市の児童養護施設の子どもたちの生活と、施設の建て替えを寄付で支えられます。", en: "Support children's lives at a Sendai children's home and the rebuilding of its premises." },
    description: { ja: "宮城県仙台市宮城野区にある社会福祉法人善き牧者会の児童養護施設です。寄付金は子どもたちの生活の質の向上や自立・社会経験の支援、施設の建て替えなどに使われます。", en: "A children's home in Miyagino Ward, Sendai, run by the Good Shepherd social welfare corporation. Donations improve the children's quality of life, support their independence and social experience, and help fund the rebuilding of the home." },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://sayurien.com/support.html", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🌸",
  },
  // pref: 山形県
  // verified 2026-10-15: https://yamagatashi-sj.or.jp/facility/facility02/ — 山形学園ひとつぶの種の会基金 for leavers' new-life costs (PDF: contact office → 郵便振替 slip); page says NOT tax-deductible; page modified 2025-04
  {
    slug: "yamagata-gakuen-yamagata",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人山形市社会福祉事業団 児童養護施設山形学園（山形県山形市）", en: "Yamagata Gakuen Children's Home (Yamagata City, Yamagata)" },
    summary: { ja: "山形学園を退所する若者の新生活を支える基金に寄付できます。", en: "Give to a fund that helps young people leaving Yamagata Gakuen start their new lives." },
    description: { ja: "山形市蔵王上野にある、社会福祉法人山形市社会福祉事業団が運営する定員37名の児童養護施設です。「ひとつぶの種の会基金」は、退所する高校生の進学・就職時の新生活資金を援助しています。", en: "A children's home for up to 37 children in Zao-Ueno, Yamagata City, run by the Yamagata City Social Welfare Service Corporation. Its Hitotsubu no Tane fund helps high-school leavers with the cost of starting university or work." },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://yamagatashi-sj.or.jp/facility/facility02/", via: { ja: "施設の公式ページ（基金のご案内）", en: "the home's official page (fund information)" } },
    emoji: "🌱",
  },
  // pref: 福島県
  // verified 2026-10-15: https://shirakawagakuen.or.jp/pages/32/ — monetary donations via 寄付申込書 obtained from office (tel); donor thanks page; latest news 2026-09-07
  {
    slug: "shirakawa-gakuen-fukushima",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人白河学園 児童養護施設白河学園（福島県白河市）", en: "Shirakawa Gakuen Children's Home (Shirakawa, Fukushima)" },
    summary: { ja: "福島県白河市の児童養護施設の子どもたちへの支援を、寄付で厚くできます。", en: "Strengthen support for the children at a children's home in Shirakawa, Fukushima." },
    description: { ja: "福島県白河市にある社会福祉法人白河学園の児童養護施設です。養育費は国・県の措置費で賄われており、寄付金は子どもたちへの支援をさらに充実させるために使われます。", en: "A children's home in Shirakawa, Fukushima, run by the social welfare corporation Shirakawa Gakuen. Basic care is publicly funded, and donations strengthen the support the children receive." },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://shirakawagakuen.or.jp/pages/32/", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🏯",
  },
  // pref: 茨城県
  // verified 2026-10-15: https://www.runbini.info/bosyu/ — invites 寄附金 (contact facility first by phone) for 自立支援基金「ののの会」 (grants/loans to leavers); latest news 2026-10-07
  {
    slug: "runbini-ibaraki",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人照桑福祉会 児童養護施設るんびにー（茨城県行方市）", en: "Runbini Children's Home (Namegata, Ibaraki)" },
    summary: { ja: "施設を巣立った若者の進学や生活を支える自立支援基金に寄付できます。", en: "Give to a fund that helps young people who have left care with study and living costs." },
    description: { ja: "茨城県行方市にある社会福祉法人照桑福祉会の児童養護施設です。寄付金は自立支援のための基金「ののの会」に積み立てられ、退所後の進学助成や生活困窮時の貸付、出産祝い金などに使われます。", en: "A children's home in Namegata, Ibaraki, run by the social welfare corporation Shoso Fukushikai. Cash gifts go into its Nonono-kai independence fund, which provides study grants, hardship loans and childbirth gifts to young people after they leave care." },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://www.runbini.info/bosyu/", via: { ja: "施設の公式寄付案内", en: "the home's official donation information" } },
    emoji: "🌻",
  },
  // pref: 群馬県
  // verified 2026-10-15: https://www.francisco.or.jp/ — homepage lists ゆうちょ 00380-2-17094 (友の会, general support) and 群馬銀行 account for leavers' scholarships; latest posts 2026-10-13
  {
    slug: "francisco-no-machi-gunma",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人フランシスコの町 児童養護施設フランシスコの町（群馬県高崎市）", en: "Francisco no Machi Children's Home (Takasaki, Gunma)" },
    summary: { ja: "高崎市の児童養護施設と、退所した若者の奨学金を寄付で支えられます。", en: "Support a Takasaki children's home and scholarships for young people who have left it." },
    description: { ja: "群馬県高崎市で2歳から18歳までの子どもたちが暮らす児童養護施設です。寄付は施設への一般支援の口座と、退所した子どもたちの奨学金の口座に分けて受け付けています。", en: "A children's home in Takasaki, Gunma, for children aged 2 to 18. Gifts can go either to general support for the home or to a scholarship fund for young people who have left it." },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://www.francisco.or.jp/", via: { ja: "施設の公式サイト（寄付口座のご案内）", en: "the home's official website (donation accounts)" } },
    emoji: "🕊️",
  },
  // pref: 埼玉県
  // verified 2026-10-15: https://kodomonomachi.jp/wp/?page_id=22 — cash/現金書留/bank transfer + application form, 税額控除対象法人 with certificate PDF (2026/06); latest news 2026-08-26
  {
    slug: "kodomo-no-machi-saitama",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人子供の町 児童養護施設子供の町（埼玉県春日部市）", en: "Kodomo no Machi Children's Home (Kasukabe, Saitama)" },
    summary: { ja: "春日部市の児童養護施設の子どもたちと、大学進学の奨学基金を寄付で支えられます。", en: "Support the children at a Kasukabe children's home and its university scholarship fund." },
    description: { ja: "埼玉県春日部市で児童養護施設「子供の町」と「エンジェルホーム」を運営する社会福祉法人です。寄付金は入所児童の支援や大学に通う子どものための奨学基金、送迎車両の購入などに使われます。", en: "A social welfare corporation in Kasukabe, Saitama, that runs the Kodomo no Machi and Angel Home children's homes. Donations support the children in care, a scholarship fund for residents at university, and needs such as transport vehicles." },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://kodomonomachi.jp/wp/?page_id=22", via: { ja: "法人の公式寄付ページ", en: "the corporation's official donation page" } },
    emoji: "🏡",
  },
  // pref: 千葉県
  // verified 2026-10-15: https://ichiryuukai.org/ご寄附・ご寄贈/ — bank transfer (京葉銀行, account from 2026-01-01) or 現金書留, contact first; latest news 2026-10-08
  {
    slug: "nonohana-no-ie-chiba",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人一粒会 児童養護施設野の花の家（千葉県木更津市）", en: "Nonohana no Ie Children's Home (Kisarazu, Chiba)" },
    summary: { ja: "木更津市の児童養護施設で暮らす子どもたちの学びや暮らしを寄付で応援できます。", en: "Support learning and daily life for the children at a children's home in Kisarazu, Chiba." },
    description: { ja: "千葉県木更津市で児童養護施設「野の花の家」や自立援助ホームを運営する社会福祉法人一粒会です。運営は国・自治体の措置費で賄われており、寄付は教育・学習塾や習い事、施設の改善に役立てられます。", en: "Ichiryuukai runs the Nonohana no Ie children's home and a supported-living home for young people in Kisarazu, Chiba. Its operations are publicly funded, and donations help with education, tutoring, lessons and improvements to the home." },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://ichiryuukai.org/%e3%81%94%e5%af%84%e9%99%84%e3%83%bb%e3%81%94%e5%af%84%e8%b4%88/", via: { ja: "法人の公式寄付ページ", en: "the corporation's official donation page" } },
    emoji: "🌼",
  },
  // pref: 千葉県 (after-care)
  // verified 2026-10-15: http://www.chibakenshakyo.com/0000kifu_page2023.php?001 — online donation application form (or by phone) for 千葉県 児童養護施設等退所者奨学金; deductible under 所得税法78条; prefecture page updated 2025-09-17
  {
    slug: "chiba-care-leaver-scholarship",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人千葉県社会福祉協議会 児童養護施設等退所者奨学金（千葉県千葉市）", en: "Chiba Care-Leaver Scholarship Fund (Chiba City, Chiba)" },
    summary: { ja: "児童養護施設などを退所して進学する若者のための千葉県の奨学金に寄付できます。", en: "Give to Chiba Prefecture's scholarship for young people going on to study after leaving care." },
    description: { ja: "千葉県の児童養護施設等退所者向け奨学金制度は全額が寄付で賄われ、千葉県社会福祉協議会が県に代わって基金を管理しています。寄付金は全額が奨学金として退所者の進学を支えます。", en: "Chiba Prefecture's scholarship for care leavers is funded entirely by donations, with the Chiba Prefectural Council of Social Welfare managing the fund on the prefecture's behalf. The full amount of each gift goes to scholarships for care leavers in further education." },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.chibakenshakyo.com/0000kifu_page2023.php?001", via: { ja: "千葉県社会福祉協議会の公式寄付ページ", en: "the Chiba Prefectural Council of Social Welfare's official donation page" } },
    emoji: "🎓",
  },
  // pref: 東京都
  // verified 2026-10-15: https://syncable.biz/associate/to-iku — linked from to-iku.or.jp (also 郵便振替/城南信金); card/Amazon Pay, one-off or monthly, 寄付金控除対象; official site news 2026-08-21
  {
    slug: "tokyo-ikuseien-tokyo",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人東京育成園 児童養護施設東京育成園（東京都世田谷区）", en: "Tokyo Ikuseien Children's Home (Setagaya, Tokyo)" },
    summary: { ja: "世田谷区の児童養護施設東京育成園に、オンラインで寄付できます。", en: "Give online to Tokyo Ikuseien, a children's home in Setagaya, Tokyo." },
    description: { ja: "東京都世田谷区上馬にある社会福祉法人東京育成園の児童養護施設です。クレジットカードやAmazon Payで単発・毎月の寄付ができ、寄付金控除の対象です。", en: "A children's home in Kamiuma, Setagaya, Tokyo, run by the social welfare corporation Tokyo Ikuseien. One-off or monthly gifts can be made by card or Amazon Pay and qualify for the donation deduction." },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://syncable.biz/associate/to-iku", via: { ja: "施設の公式寄付ページ（Syncable）", en: "the home's official donation page (Syncable)" } },
    emoji: "🌳",
  },
  // pref: 東京都
  // verified 2026-10-15: https://www.megurowakabaryo.com/donation/ — monthly supporter by card + bank transfer (三菱UFJ), 特定寄付金 deduction explained; page modified 2026-01-19, news 2026-10-06
  {
    slug: "meguro-wakabaryo-tokyo",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人愛隣会 児童養護施設目黒若葉寮（東京都目黒区）", en: "Meguro Wakabaryo Children's Home (Meguro, Tokyo)" },
    summary: { ja: "目黒区の児童養護施設の改修やグループホーム、子どもの自立支援を寄付で支えられます。", en: "Help a Meguro children's home with renovation, group homes and independence support." },
    description: { ja: "東京都目黒区大橋にある社会福祉法人愛隣会の児童養護施設です。寄付金は施設の改修、グループホームの拡充・強化、子どもたちの自立支援に使われます。", en: "A children's home in Ohashi, Meguro, Tokyo, run by the social welfare corporation Airinkai. Donations fund renovation, more and better group homes, and support for the children's independence." },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.megurowakabaryo.com/donation/", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🍃",
  },
  // pref: 東京都 (after-care)
  // verified 2026-10-15: https://wfc.or.jp/support/ — ゆうちょ/みずほ transfer + Syncable online (card/Amazon Pay), Tokyo-certified, deductions explained; FY2026 tour flyer (2026/08)
  {
    slug: "seishonen-fukushi-center-tokyo",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人青少年福祉センター（東京都足立区）", en: "Youth Welfare Centre (Adachi, Tokyo)" },
    summary: { ja: "日本初の自立援助ホームを開いた法人の、児童養護施設と若者の自立支援を寄付で支えられます。", en: "Support the organisation behind Japan's first supported-living home for young care leavers." },
    description: { ja: "1958年に設立され、東京都で自立援助ホーム3か所と児童養護施設2か所などを運営する社会福祉法人です。寄付金は公費で足りない子ども一人ひとりへの支援や施設の改修に使われます。", en: "Founded in 1958, this Tokyo social welfare corporation runs three supported-living homes for young people, two children's homes and other services. Donations fund individual support for each young person and facility renovation that public money does not cover." },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://wfc.or.jp/support/", via: { ja: "法人の公式寄付ページ", en: "the organisation's official donation page" } },
    emoji: "🤝",
  },
  // pref: 神奈川県
  // verified 2026-10-15: https://www.kodomonosono.or.jp/publics/index/20/ — card/PayPay online, bank/postal transfer, 特定寄附金 (deduction or credit) explained; latest news 2026-09-27
  {
    slug: "kodomo-no-sono-chigasaki",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人福光会 児童養護施設子どもの園（神奈川県茅ヶ崎市）", en: "Kodomo no Sono Children's Home (Chigasaki, Kanagawa)" },
    summary: { ja: "茅ヶ崎市の児童養護施設に、カードやPayPayでも寄付できます。", en: "Give to a Chigasaki children's home by card, PayPay or bank transfer." },
    description: { ja: "神奈川県茅ヶ崎市で約40人の子どもたちが職員と暮らす、社会福祉法人福光会の児童養護施設です。寄付金は子どもたちがより安心・安全・快適に暮らすために使われます。", en: "A children's home in Chigasaki, Kanagawa, run by Fukukokai, where about 40 children live with staff. Donations help the children live more safely, securely and comfortably." },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.kodomonosono.or.jp/publics/index/20/", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🌊",
  },
  // pref: 神奈川県
  // verified 2026-10-15: https://seikou-fukushikai.org/donate.html — Congrant card link, 郵便振替 00260-1-82833, ゆうちょ transfer; deduction (not credit) stated; site cites 経営協 2025-03 feature
  {
    slug: "seikou-gakuen-zama",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人成光福祉会 児童養護施設成光学園（神奈川県座間市）", en: "Seikou Gakuen Children's Home (Zama, Kanagawa)" },
    summary: { ja: "座間市の児童養護施設の運営や居住棟の建て替えを寄付で支えられます。", en: "Support the running of a Zama children's home and the rebuilding of its living quarters." },
    description: { ja: "神奈川県座間市緑ケ丘にある社会福祉法人成光福祉会の児童養護施設です。寄付金は施設の運営や居住棟の建て替えの自己負担分、小規模ホームなどの計画に使われます。", en: "A children's home in Midorigaoka, Zama, Kanagawa, run by the social welfare corporation Seikou Fukushikai. Donations fund the home's running costs, its own share of rebuilding the living quarters, and plans such as small group homes." },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://seikou-fukushikai.org/donate.html", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "☀️",
  },
  // pref: 新潟県
  // verified 2026-10-15: https://niigatacaritas.or.jp/supportus/ — transfers to 新潟天使園 etc. (contact via form/phone for details), 寄付控除 receipts issued; Tenshien page modified 2026-09-08
  {
    slug: "niigata-tenshien-niigata",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人新潟カリタス会 児童養護施設新潟天使園（新潟県新潟市）", en: "Niigata Tenshien Children's Home (Niigata City, Niigata)" },
    summary: { ja: "新潟市の児童養護施設で暮らす子どもたちの自立を寄付で支えられます。", en: "Help the children at a Niigata City children's home move steadily towards independence." },
    description: { ja: "新潟市西区青山にある定員35名の児童養護施設で、社会福祉法人新潟カリタス会が運営しています。寄付金は子どもたちが着実に自立へ向かえるよう大切に使われ、寄付控除用の領収証が発行されます。", en: "A children's home for up to 35 children in Aoyama, Nishi Ward, Niigata City, run by the social welfare corporation Niigata Caritas. Donations help the children move steadily towards independence, and receipts for the tax deduction are issued." },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://niigatacaritas.or.jp/supportus/", via: { ja: "法人の公式寄付ページ", en: "the corporation's official donation page" } },
    emoji: "👼",
  },
  // pref: 富山県
  // verified 2026-10-15: https://www.lunbinien.jp/pages/22 — 寄付募集 page with bank transfer (北陸銀行越前町支店), receipt on request; latest topics 2026-09-28
  {
    slug: "lunbinien-toyama",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人ルンビニ園 児童養護施設ルンビニ園（富山県富山市）", en: "Lunbini-en Children's Home (Toyama City, Toyama)" },
    summary: { ja: "富山市の児童養護施設ルンビニ園を寄付で応援できます。", en: "Support Lunbini-en, a children's home in Toyama City, with a donation." },
    description: { ja: "富山県富山市中布目にある社会福祉法人ルンビニ園の児童養護施設で、小規模なホームを増やしています。寄付は銀行振込で受け付けており、希望者には領収書が発行されます。", en: "A children's home in Nakanunome, Toyama City, run by the social welfare corporation Lunbini-en, which is opening more small group homes. Gifts are accepted by bank transfer, and receipts are issued on request." },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://www.lunbinien.jp/pages/22", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🪷",
  },
  // pref: 石川県
  // verified 2026-10-15: https://www.rinshoen.or.jp/pages/29/ — bank (北陸銀行) / ゆうちょ 00750-4-14972 transfers to 入所児童支援事業 fund (174 gifts as of 2025-07)
  {
    slug: "rinshoen-kanazawa",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人林鐘園 児童養護施設林鐘園（石川県金沢市）", en: "Rinshoen Children's Home (Kanazawa, Ishikawa)" },
    summary: { ja: "金沢市の児童養護施設で、子どもたちの特技や退所後の自立を支える基金に寄付できます。", en: "Give to a Kanazawa children's home fund that nurtures children's talents and supports them after they leave." },
    description: { ja: "石川県金沢市若松町にある社会福祉法人林鐘園の児童養護施設です。寄付金は入所中から退所後3年までの子どもの特技の育成や自立のための経済的支援を行う「入所児童支援事業」の基金に使われています。", en: "A children's home in Wakamatsu, Kanazawa, Ishikawa, run by the social welfare corporation Rinshoen. Donations go to its children's support fund, which nurtures children's talents and gives financial help towards independence while they are in care and for up to three years after they leave." },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://www.rinshoen.or.jp/pages/29/", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🔔",
  },
  // pref: 山梨県
  // verified 2026-10-15: https://jidouyougo-clovergakuen.net/donate — monetary gifts by phone/inquiry form, 特定公益増進法人 → 寄付金控除; donation thanks 2026-07-01, news 2026-07-13
  {
    slug: "clover-gakuen-yamanashi",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人光塩福祉会 児童養護施設クローバー学園（山梨県甲州市）", en: "Clover Gakuen Children's Home (Koshu, Yamanashi)" },
    summary: { ja: "甲州市の児童養護施設の子どもたちと、退所する若者の自立を寄付で支えられます。", en: "Support the children at a Koshu children's home and young people as they leave care." },
    description: { ja: "山梨県甲州市塩山にある社会福祉法人光塩福祉会の児童養護施設です。寄付金は公費で賄えない生活用品や、退所時の自立・進学費用、退所者の生活支援に使われます。", en: "A children's home in Enzan, Koshu, Yamanashi, run by the social welfare corporation Koen Fukushikai. Donations pay for everyday items public funds do not cover, independence and school costs when children leave, and living support for former residents." },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://jidouyougo-clovergakuen.net/donate", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🍀",
  },
  // pref: 長野県
  // verified 2026-10-15: https://e-gaku.or.jp/donation/ — bank transfer (長野信金/楽天銀行) from ¥1, anonymous OK; uses listed; latest blog 2026-10-11
  {
    slug: "iiyama-gakuen-nagano",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人飯山学園 児童養護施設飯山学園（長野県飯山市）", en: "Iiyama Gakuen Children's Home (Iiyama, Nagano)" },
    summary: { ja: "飯山市の児童養護施設の子どもたちの巣立ちや経験の幅を寄付で広げられます。", en: "Help children at an Iiyama children's home broaden their experiences and start out on their own." },
    description: { ja: "長野県飯山市南町にある社会福祉法人飯山学園の児童養護施設です。寄付金は退所時の就職・進学の支度金、子どもたちの教育やレクリエーション、遊具など設備の維持に使われます。", en: "A children's home in Minamimachi, Iiyama, Nagano, run by the social welfare corporation Iiyama Gakuen. Donations provide start-up money for children leaving for work or study, education and recreation costs, and upkeep of facilities such as play equipment." },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://e-gaku.or.jp/donation/", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "⛰️",
  },
  // pref: 熊本県
  // verified 2026-10-15: https://jiaien.or.jp/volunteer/ — "寄付のお願い" section with an online application form, then transfer to ゆうちょ/三井住友/三菱UFJ (account sent after applying); page says gifts get income/resident-tax deductions; site shows recruitment notices for April 2026 hires (posted 2025). Form lets donor pick the facility.
  {
    slug: "jiaien-childrens-home-kumamoto",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人慈愛園 児童養護施設 慈愛園子供ホーム（熊本県熊本市）", en: "Jiaien Children's Home (Kumamoto City, Kumamoto)" },
    summary: {
      ja: "熊本市で100年以上続く法人が運営する児童養護施設を支えます。",
      en: "Supports a children's home run by a Kumamoto welfare body with over a century of history.",
    },
    description: {
      ja: "熊本市中央区の社会福祉法人慈愛園が運営する児童養護施設で、家庭で暮らせない子どもたちを児童相談所からの措置で受け入れています。寄付は申込フォームから施設を選んで申し込むことができ、子どもたちの遊具や行事の用品などに使われます。",
      en: "A children's home run by the Jiaien welfare corporation in Chuo Ward, Kumamoto City, caring for children placed by the child guidance centre who cannot live at home. Donors apply through a form where they can choose the facility, and gifts pay for play equipment and supplies for events for the children.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://jiaien.or.jp/volunteer/", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🏡",
  },
  // pref: 熊本県
  // verified 2026-10-15: https://fujisakidaidoen.com/doen/support/ — 藤崎台童園後援会: individuals ¥2,000/unit, groups ¥10,000/unit a year, application by post/email/FAX then a 郵便振替 slip is sent; no tax statement; site news to 2026.10.13. (Supporters' association fee, not a one-off gift form.)
  {
    slug: "fujisakidai-doen-kumamoto",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人藤崎台童園 児童養護施設 藤崎台童園（熊本県熊本市）", en: "Fujisakidai Doen Children's Home (Kumamoto City, Kumamoto)" },
    summary: {
      ja: "後援会の会員になって熊本市の児童養護施設の子どもたちを支えます。",
      en: "Become a member of the supporters' association of a children's home in Kumamoto City.",
    },
    description: {
      ja: "熊本市中央区古京町にある児童養護施設で、社会福祉法人藤崎台童園が保育園とあわせて運営しています。後援会の会費は、子どもたちの進学や就職・自立への援助、施設の活動支援や設備の整備などに使われます。",
      en: "A children's home in Kokyo-machi, Chuo Ward, Kumamoto City, run by the Fujisakidai Doen welfare corporation alongside a nursery. Fees paid to its supporters' association help children go on to further study or work and become independent, and support the home's activities and equipment.",
    },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://fujisakidaidoen.com/doen/support/", via: { ja: "施設の公式後援会ページ", en: "the home's official supporters' association page" } },
    emoji: "🌳",
  },
  // pref: 福岡県
  // verified 2026-10-15: https://www.wakaji.jp/donation/ — one-off or monthly online giving via Congrant (card or bank), plus direct transfer to 福岡銀行若松支店; lists uses in detail; no tax statement; home page news to 2026.09.13.
  {
    slug: "wakamatsu-jido-home-fukuoka",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人若松児童ホーム 児童養護施設 若松児童ホーム（福岡県北九州市）", en: "Wakamatsu Children's Home (Kitakyushu, Fukuoka)" },
    summary: {
      ja: "北九州市の児童養護施設で暮らす子どもの生活と自立を支えます。",
      en: "Supports the daily lives and independence of children at a home in Kitakyushu.",
    },
    description: {
      ja: "北九州市若松区の児童養護施設で、さまざまな事情で家庭で暮らせない子どもたちが生活しています。寄付は家具や家電などの生活環境、学習用品や受験の支援、退所後の自立やアフターケア、心理ケア、旅行や体験活動などに使われます。",
      en: "A children's home in Wakamatsu Ward, Kitakyushu, for children who cannot live with their families. Donations pay for furniture and appliances, school supplies and exam support, help with independence and aftercare after leaving, psychological care, and trips and other experiences.",
    },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://www.wakaji.jp/donation/", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🎒",
  },
  // pref: 福岡県
  // verified 2026-10-15: https://ikujiin.com/donation/ — online application form (also FAX/email/phone); page explains income-tax and corporate deductions with the home's receipt; current appeal is rebuilding/renovating the main building; home page shows R8 (2026) recruitment exam 2026-09-13 and a project starting Oct 2026.
  {
    slug: "fukuoka-ikujiin-fukuoka",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人福岡育児院 児童養護施設 福岡育児院（福岡県福岡市）", en: "Fukuoka Ikujiin Children's Home (Fukuoka City, Fukuoka)" },
    summary: {
      ja: "福岡市の児童養護施設の本園の建て替え・改修を支えます。",
      en: "Helps a Fukuoka City children's home rebuild and renovate its main building.",
    },
    description: {
      ja: "福岡市東区原田にある児童養護施設で、家族はいても家庭で暮らすことができない子どもたちを養育しています。公的な措置費だけでは足りない子どもたちへの支援を補うため寄付を募っており、現在は本園の新築・改修に使われます。",
      en: "A children's home in Harada, Higashi Ward, Fukuoka City, caring for children who have families but cannot live at home. It asks for donations to fill the gap left by public funding, and current gifts go towards building and renovating its main facility.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://ikujiin.com/donation/", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🏗️",
  },
  // pref: 大阪府
  // verified 2026-10-15: https://uminoko.org/donation-contact/ — "うみっこ基金" (後援会): online application form, then free 郵便振替 slip mailed, or direct transfer to 00980-9-284002; individuals from ¥2,000/unit, groups ¥10,000/unit; no tax statement; blog posts to 2026/09/20, 2026 後援会 report PDF.
  {
    slug: "uminoko-gakuen-osaka",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人海の子学園 児童養護施設 入舟寮・池島寮（大阪府大阪市）", en: "Uminoko Gakuen Children's Homes (Osaka City, Osaka)" },
    summary: {
      ja: "大阪市港区の児童養護施設の子どもたちの進学と自立を応援します。",
      en: "Helps children at two Osaka children's homes go on to study and live independently.",
    },
    description: {
      ja: "大阪市港区の社会福祉法人海の子学園は児童養護施設の入舟寮と池島寮を運営し、約130人の子どもたちが暮らしています。後援会の「うみっこ基金」は、子どもたちの進学や自立の支援、緊急の生活支援、児童福祉の研究・啓発などに使われます。",
      en: "The Uminoko Gakuen welfare corporation in Minato Ward, Osaka, runs the Irifune-ryo and Ikejima-ryo children's homes, where about 130 children live. Its supporters' fund, Umikko Kikin, pays for help with further study and independence, emergency living support, and child-welfare research and awareness.",
    },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://uminoko.org/donation-contact/", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🌊",
  },
  // pref: 愛知県
  // verified 2026-10-15: https://umegaoka.site/support/ — "寄付金を常時受けつけています": online support form (bank details emailed after choosing 振込), donor picks use (children / operating costs / other); receipts issued citing 所得税法78条2項3号・法人税法37条; site posts to 2026-10-07.
  {
    slug: "umegaoka-gakuen-aichi",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人愛知玉葉会 児童養護施設 梅ヶ丘学園（愛知県豊田市）", en: "Umegaoka Gakuen Children's Home (Toyota, Aichi)" },
    summary: {
      ja: "豊田市で親元を離れて暮らす子どもたちの生活を支えます。",
      en: "Supports children living apart from their parents at a home in Toyota.",
    },
    description: {
      ja: "愛知県豊田市梅坪町にある児童養護施設で、さまざまな事情で親元を離れて暮らす子どもたちが生活しています。寄付は入所している子どもたちのため、または施設の運営費などに、寄付者が選んだ使い道で使われます。",
      en: "A children's home in Umetsubo-cho, Toyota, Aichi, for children who must live apart from their parents. Donors choose whether their gift goes to the children living there, to the home's running costs or to another purpose.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://umegaoka.site/support/", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🌸",
  },
  // pref: 静岡県
  // verified 2026-10-15: https://www.shumpu.or.jp/donation/ — bank transfer to 静岡銀行焼津支店 普通0861700; page says gifts are 特定寄付金 eligible for income deduction; latest report is FY2025 H2 donations (posted May 2026); news to 2026.09.15.
  {
    slug: "shumpuryo-shizuoka",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人春風寮 児童養護施設 春風寮（静岡県焼津市）", en: "Shumpuryo Children's Home (Yaizu, Shizuoka)" },
    summary: {
      ja: "焼津市の児童養護施設で子どもたちの暮らしと楽しみを支えます。",
      en: "Adds comfort and fun to children's lives at a home in Yaizu.",
    },
    description: {
      ja: "静岡県焼津市田尻にある児童養護施設で、児童家庭支援センターなどもあわせて運営しています。寄付は家庭では買ってもらえるような物や生活を豊かにする物、キャンプや映画・外食などの行事、必要な備品に使われます。",
      en: "A children's home in Tajiri, Yaizu, Shizuoka, which also runs a child and family support centre. Donations buy the things a family would provide and that enrich daily life, pay for camps, films, meals out and other outings, and cover necessary supplies.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.shumpu.or.jp/donation/", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🍃",
  },
  // pref: 静岡県
  // verified 2026-10-15: https://www.saiseikai-kawana.jp/kifu/ — application form (Word/PDF by FAX/post) plus transfer to 静岡銀行伊東支店 普通0818801; page says individual gifts are income/resident-tax deductible; newsletter No.580 dated 2026-09-01.
  {
    slug: "kawana-rinkai-gakuen-shizuoka",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人恩賜財団静岡県済生会 児童養護施設 川奈臨海学園（静岡県伊東市）", en: "Kawana Rinkai Gakuen Children's Home (Ito, Shizuoka)" },
    summary: {
      ja: "伊東市の海辺の児童養護施設で暮らす子どもたちを支えます。",
      en: "Supports children living at a seaside children's home in Ito.",
    },
    description: {
      ja: "静岡県伊東市川奈にある児童養護施設で、2021年に建て替えられ、少人数の生活単位で家庭的な環境をつくっています。寄付は子どもたちのため、子どもたちへの支援、施設の整備などに使われます。",
      en: "A children's home in Kawana, Ito, Shizuoka, rebuilt in 2021 so that children live in small, family-like groups. Donations are used for the children, for supporting them and for improving the facilities.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.saiseikai-kawana.jp/kifu/", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🌅",
  },
  // pref: 滋賀県
  // verified 2026-10-15: https://moriyama-gakuen.jp/support/donate — transfer to 滋賀銀行守山北支店 (two accounts: facility improvement / children in residence) then a 振込済みお知らせフォーム; no tax statement; news lists events on 2026-10-25 and 2026-11-07.
  {
    slug: "moriyama-gakuen-shiga",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人ひかり会 児童養護施設 守山学園（滋賀県守山市）", en: "Moriyama Gakuen Children's Home (Moriyama, Shiga)" },
    summary: {
      ja: "守山市の児童養護施設の子どもたちと施設の整備を支えます。",
      en: "Supports the children and the buildings of a children's home in Moriyama.",
    },
    description: {
      ja: "滋賀県守山市笠原町にある児童養護施設で、さまざまな事情で家族と離れて暮らす子どもたちが生活しています。寄付は振込先の口座によって、施設の整備費か入所している子どもたちのために使われます。",
      en: "A children's home in Kasahara-cho, Moriyama, Shiga, for children living apart from their families. Depending on the account chosen, gifts go to improving the facilities or directly to the children living there.",
    },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://moriyama-gakuen.jp/support/donate", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🌾",
  },
  // pref: 京都府
  // verified 2026-10-15: https://www.kyoto-seieikai.org/support/ — ゆうちょ振替 00910-2-170525 (fees borne by the home); page says gifts qualify for the deduction under 所得税法78条; FY2025 donor list and FY2026 festival notice on the page; page modified 2026-07-20.
  {
    slug: "kyoto-seieikai-kyoto",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人 児童養護施設 京都聖嬰会（京都府京都市）", en: "Kyoto Seieikai Children's Home (Kyoto City, Kyoto)" },
    summary: {
      ja: "京都市の児童養護施設の子どもたちの進学・就職・自立を支えます。",
      en: "Helps children at a Kyoto home with further study, jobs and independence.",
    },
    description: {
      ja: "京都市北区衣笠、金閣寺の近くにある社会福祉法人の児童養護施設です。寄付は子どもたちの進学・就職・生活などの自立支援に限って使われます。",
      en: "A children's home run by a social welfare corporation in Kinugasa, Kita Ward, Kyoto, near Kinkaku-ji. Donations are used only to help the children become independent, covering further study, employment and daily living.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://www.kyoto-seieikai.org/support/", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "⛩️",
  },
  // pref: 兵庫県
  // verified 2026-10-15: https://shinai-g.com/donation — ゆうちょ 01160-6-1554 (社会福祉法人信愛学園); page says donations are tax-deductible; children's-home page lists job fairs on 2026-04-26, 2026-06-21 and 2026-10-18.
  {
    slug: "shinai-gakuen-hyogo",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人信愛学園 児童養護施設 信愛学園（兵庫県神戸市）", en: "Shinai Gakuen Children's Home (Kobe, Hyogo)" },
    summary: {
      ja: "神戸市東灘区の児童養護施設で暮らす子どもたちを支えます。",
      en: "Supports children living at a children's home in Higashinada, Kobe.",
    },
    description: {
      ja: "神戸市東灘区御影にあるキリスト教精神に基づく児童養護施設で、家庭で暮らせない子どもたちを小規模・家庭的な養育で支え、心理ケアや自立・アフターケアも行っています。寄付は子どもたちのために使われます。",
      en: "A Christian children's home in Mikage, Higashinada Ward, Kobe, raising children who cannot live at home in small, family-style groups, with psychological care and support for independence and aftercare. Donations are used for the children.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://shinai-g.com/donation", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🕊️",
  },
  // pref: 鳥取県
  // verified 2026-10-15: https://www.tottorikodomogakuen.or.jp/bokinjigyo — ¥1,000/unit; 郵便振替 01490-9-9106, 山陰合同銀行・鳥取銀行 accounts, and online card giving (VISA/JCB/AMEX, per the linked 法令表記 page); links to a 寄附控除 page but deductibility not stated on this page; home page news to 2026.09.30.
  {
    slug: "tottori-kodomo-gakuen-tottori",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人鳥取こども学園 児童養護施設 鳥取こども学園（鳥取県鳥取市）", en: "Tottori Kodomo Gakuen Children's Home (Tottori City, Tottori)" },
    summary: {
      ja: "1906年から続く鳥取市の児童養護施設の子どもたちの活動を支えます。",
      en: "Supports activities for children at a Tottori home running since 1906.",
    },
    description: {
      ja: "鳥取市立川町を拠点に1906年から活動する社会福祉法人で、児童養護施設のほか乳児院や児童心理治療施設なども運営しています。募金は1口1,000円から受け付け、子どもたちへの活動に使われます。",
      en: "A welfare corporation based in Tachikawa-cho, Tottori City, working since 1906 and running a children's home as well as an infant home and a child psychological treatment facility. Gifts start at ¥1,000 per unit and fund activities for the children.",
    },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://www.tottorikodomogakuen.or.jp/bokinjigyo", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🏔️",
  },
  // pref: 岡山県
  // verified 2026-10-15: https://www.shintenchi-ikujiin.com/blank-1 — 郵便振替 accounts for child welfare work (01370-7-2974) and a university-entrance fund (01340-7-107567); no tax statement; home page lists 新天地こどもまつり on 2026-06-20.
  {
    slug: "shintenchi-ikujiin-okayama",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人新天地育児院 児童養護施設 新天地育児院（岡山県岡山市）", en: "Shintenchi Ikujiin Children's Home (Okayama City, Okayama)" },
    summary: {
      ja: "石井十次の岡山孤児院につながる児童養護施設の子どもたちを応援します。",
      en: "Backs children at an Okayama home descended from Ishii Juji's orphanage.",
    },
    description: {
      ja: "岡山市中区門田本町にある児童養護施設で、石井十次が創設した岡山孤児院の流れをくんでいます。寄付は児童福祉事業のほか、子どもたちの習い事や大学進学のための基金に使われます。",
      en: "A children's home in Kadota Honmachi, Naka Ward, Okayama City, which traces its roots to the Okayama Orphanage founded by Ishii Juji. Donations support its child-welfare work and a fund for children's lessons and university entrance.",
    },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://www.shintenchi-ikujiin.com/blank-1", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "📚",
  },
  // pref: 広島県
  // verified 2026-10-15: https://kobushinomura.com/donation/ — online donation form (¥3,000–¥50,000 or custom), pay by cash or 広島銀行 transfer; page says receipts are issued for tax benefits; こぶしヶ丘学園 page news to 2026.10.08, blog to 2026.08.30.
  {
    slug: "kobushigaoka-gakuen-hiroshima",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人こぶしの村福祉会 児童養護施設 こぶしヶ丘学園（広島県福山市）", en: "Kobushigaoka Gakuen Children's Home (Fukuyama, Hiroshima)" },
    summary: {
      ja: "福山市の児童養護施設で暮らす2歳から18歳の子どもたちを支えます。",
      en: "Supports children aged 2 to 18 at a children's home in Fukuyama.",
    },
    description: {
      ja: "広島県福山市加茂町の社会福祉法人こぶしの村福祉会が運営する児童養護施設で、おおむね2歳から18歳の子どもたちが5つの家庭的なユニットで暮らしています。寄付は理事会の審議を経て、必要とする各施設の運営に使われます。",
      en: "A children's home run by the Kobushi no Mura welfare corporation in Kamo-cho, Fukuyama, Hiroshima, where children aged roughly 2 to 18 live in five family-style units. After review by the board, donations go to the running of the facilities that need them.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://kobushinomura.com/donation/", via: { ja: "法人の公式寄付ページ", en: "the operator's official donation page" } },
    emoji: "🌼",
  },
  // pref: 香川県
  // verified 2026-10-15: https://4on.or.jp/kameyama/support — "ご寄付・ご支援" page: 亀ちゃん基金 (亀山学園奨学基金), pay at the home or by 郵便振替 01640-0-130300; no tax statement; site news to 2026/05/14 (renewed 2026/02/10).
  {
    slug: "kameyama-gakuen-kagawa",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人四恩の里 児童養護施設 亀山学園（香川県丸亀市）", en: "Kameyama Gakuen Children's Home (Marugame, Kagawa)" },
    summary: {
      ja: "丸亀市の児童養護施設の子どもたちが習い事に通えるよう支えます。",
      en: "Helps children at a Marugame home take part in after-school lessons.",
    },
    description: {
      ja: "香川県丸亀市柞原町にある児童養護施設で、家族に育てられないさまざまな事情を抱えた子どもたちが暮らしています。「亀ちゃん基金」への会費は、子どもたちが同年代の子と同じように習い事に通うための費用に使われます。",
      en: "A children's home in Marugame, Kagawa, for children who cannot be raised by their families. Payments to its Kame-chan Fund cover after-school lessons so the children can do the same activities as others their age.",
    },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://4on.or.jp/kameyama/support", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🐢",
  },
  // pref: 長崎県
  // verified 2026-10-15: https://wakatakeryou.jp/pages/38/ — monetary gifts in person or by bank transfer after submitting the inquiry form (account details sent back); no tax statement; site news to 2026-10-14.
  {
    slug: "wakatake-no-ie-nagasaki",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人若竹寮 児童養護施設 若竹の家（長崎県佐世保市）", en: "Wakatake no Ie Children's Home (Sasebo, Nagasaki)" },
    summary: {
      ja: "佐世保市の児童養護施設の子どもたちの生活・学習・自立を支えます。",
      en: "Supports the daily life, study and independence of children at a Sasebo home.",
    },
    description: {
      ja: "長崎県佐世保市柚木町にある児童養護施設で、幼児から高校生まで約45人の子どもたちが、本体施設と地域の小規模グループホームの7つのホームで暮らしています。寄付は子どもたちの生活、学習、進学、自立の支援に使われます。",
      en: "A children's home in Yunoki-cho, Sasebo, Nagasaki, where about 45 children from pre-school to high-school age live in seven homes on site and in the community. Donations support the children's daily life, study, further education and independence.",
    },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://wakatakeryou.jp/pages/38/", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🎋",
  },
  // pref: 大分県
  // verified 2026-10-15: https://sayurihome.jp/pages/29/ — transfer to 大分銀行大在支店 (corporation account or 小百合ホーム account) plus an online/emailed application for a receipt; page says gifts qualify for 寄附金控除; home page news to 2026-09-04.
  {
    slug: "sayuri-home-oita",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人小百合愛児園 児童養護施設 小百合ホーム（大分県大分市）", en: "Sayuri Home Children's Home (Oita City, Oita)" },
    summary: {
      ja: "大分市の児童養護施設で暮らす子どもたちの環境と自立を支えます。",
      en: "Improves the surroundings and independence of children at a home in Oita City.",
    },
    description: {
      ja: "大分市城原にある社会福祉法人小百合愛児園の児童養護施設です。寄付は使い道を選ぶことができ、入所している子どもたちの処遇や法人の運営に使われ、生活環境の改善や個別の支援、アフターケアにも役立てられます。",
      en: "A children's home in Oita City run by the Sayuri Aijien welfare corporation. Donors can choose the use, either care for the children living there or the corporation's running costs, and gifts help improve living conditions, individual support and aftercare.",
    },
    ...referral,
    taxDeductible: true,
    payment: { mode: "external", url: "https://sayurihome.jp/pages/29/", via: { ja: "施設の公式寄付ページ", en: "the home's official donation page" } },
    emoji: "🌷",
  },
  // pref: 沖縄県
  // verified 2026-10-15: https://www.shimazoenooka.com/support.php — 「児童を支援する会」: annual ¥5,000/unit individuals, ¥10,000/unit companies, paid to 琉球銀行・沖縄銀行・海邦銀行・JAバンク accounts or in cash; online or posted application form; no tax statement; home page news to 2026.10.09.
  {
    slug: "shimazoe-no-oka-okinawa",
    category: "welfare",
    region: "japan",
    country: { ja: "日本", en: "Japan" },
    name: { ja: "社会福祉法人豊友会 児童養護施設 島添の丘（沖縄県南城市）", en: "Shimazoe no Oka Children's Home (Nanjo, Okinawa)" },
    summary: {
      ja: "支援する会の会員になって南城市の児童養護施設の子どもたちを応援します。",
      en: "Join the supporters' association of a children's home in Nanjo, Okinawa.",
    },
    description: {
      ja: "沖縄県南城市大里にある児童養護施設で、本園のほか地域小規模児童養護施設も運営しています。「児童を支援する会」の会費は、子どもたちの健やかな成長と自立の支援に使われます。",
      en: "A children's home in Ozato, Nanjo, Okinawa, which also runs small community-based homes. Fees paid to its children's supporters' association help the children grow up healthy and become independent.",
    },
    ...referral,
    taxDeductible: false,
    payment: { mode: "external", url: "https://www.shimazoenooka.com/support.php", via: { ja: "施設の公式支援ページ", en: "the home's official support page" } },
    emoji: "🌺",
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
  // Every municipality listed here is a disaster-hit one.
  if (domestic && (r.category === "disaster" || r.category === "municipality")) return 1;
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
