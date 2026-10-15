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

  // ===== DOMESTIC (region: "japan") =====

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
