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

// Real organisations, linked to their official donation pages (checked 2026-10-13; additions 2026-10-14). None of
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
