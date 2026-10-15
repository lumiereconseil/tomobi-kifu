import type { Localized } from "./i18n";
import { byPriority, recipients, type Recipient } from "./recipients";

/**
 * A disaster guide page: what happened, which kinds of gifts exist, and every listed
 * recipient for it. Facts here come from the recipients' own official pages.
 */
export type Disaster = {
  slug: string;
  name: Localized;
  /** Start date of the disaster or the first appeal, YYYY-MM-DD. */
  since: string;
  area: Localized;
  summary: Localized;
  /** Short paragraphs shown above the recipient list. */
  body: Localized[];
  /** Listed recipients for this disaster, by slug. Unknown slugs are ignored. */
  recipientSlugs: string[];
  /** Whether appeals are still in their emergency phase (shown first). */
  active: boolean;
  emoji: string;
  /**
   * Featured campaign on the home page (Masa, 2026-10-15: Kumamoto and Chiba first).
   * `picks` are recipient slugs shown as direct buttons to their official pages.
   */
  campaign?: { headline: Localized; picks: { slug: string; label: Localized }[] };
};

export const disasters: Disaster[] = [
  {
    slug: "kumamoto-2026-earthquake",
    name: { ja: "令和8年熊本地震", en: "2026 Kumamoto Earthquake" },
    since: "2026-07-28",
    area: { ja: "熊本県（熊本市・八代市・氷川町・宇城市など）", en: "Kumamoto Prefecture (Kumamoto, Yatsushiro, Hikawa, Uki and more)" },
    summary: {
      ja: "令和8年熊本地震の被災地へ寄付できる公式窓口をまとめました。義援金・自治体への寄附・支援団体への寄付から選べます。",
      en: "Official ways to give after the 2026 Kumamoto earthquake: relief funds for residents, gifts to municipalities, and support for relief organisations.",
    },
    body: [
      {
        ja: "氷川町と宇城市では震度7が観測されました。県と被災した市町、日本赤十字社、共同募金会、支援団体がそれぞれ寄付を受け付けています。",
        en: "Seismic intensity 7 was recorded in Hikawa and Uki. The prefecture, affected towns and cities, the Japanese Red Cross, the Community Chest and relief organisations are each accepting gifts.",
      },
      {
        ja: "被災した方の生活に直接届けたい場合は義援金、復旧・復興の事業に使ってほしい場合は自治体への寄附、いま現地で動く団体を支えたい場合は支援団体への寄付が向いています。違いは「寄付の選び方」のページで説明しています。",
        en: "Choose a relief fund to reach affected residents directly, a municipal donation to fund recovery projects, or a relief organisation to support work on the ground now. Our giving guide explains the difference.",
      },
    ],
    recipientSlugs: [
      "jrc-2026-kumamoto-earthquake",
      "akaihane-kumamoto-2026-gienkin",
      "kumamoto-pref-2026-earthquake",
      "kumamoto-city-2026-earthquake",
      "yatsushiro-2026-earthquake",
      "hikawa-2026-earthquake",
      "uki-2026-earthquake",
      "borasapo-2026-kumamoto",
      "jpf-2026-kumamoto",
      "aar-japan-kumamoto-earthquake-2026",
      "peace-winds-arrows-kumamoto-2026",
      "japan-heart-kumamoto-earthquake-2026",
      "world-vision-japan-kumamoto-2026",
      "save-the-children-japan-kumamoto-2026",
    ],
    active: true,
    emoji: "🏯",
    campaign: {
      headline: { ja: "熊本地震の被災地へ", en: "Help Kumamoto recover" },
      picks: [
        { slug: "jrc-2026-kumamoto-earthquake", label: { ja: "義援金を送る（日本赤十字社）", en: "Give to the relief fund (Japanese Red Cross)" } },
        { slug: "kumamoto-pref-2026-earthquake", label: { ja: "熊本県に寄附する（ふるさと納税）", en: "Donate to Kumamoto Prefecture" } },
      ],
    },
  },
  {
    slug: "chiba-2026-flood",
    name: { ja: "千葉の豪雨・台風第25号（令和8年）", en: "Chiba Floods: August 2026 Heavy Rain and Typhoon No. 25" },
    since: "2026-08-13",
    area: { ja: "千葉県（千葉市など）", en: "Chiba Prefecture (Chiba City and more)" },
    summary: {
      ja: "令和8年8月の千葉豪雨と台風第25号で被災した千葉県の方々へ寄付できる、県と千葉市の公式窓口です。",
      en: "Official donation pages of Chiba Prefecture and Chiba City for people hit by the August 2026 heavy rain and Typhoon No. 25.",
    },
    body: [
      {
        ja: "千葉県は8月の千葉豪雨と9月の台風第25号の被災者のための義援金を一本化して募集しています。義援金は配分委員会が配分を決め、被災した市町村を通じて被災世帯に届けられます。受付は2027年3月31日までで、寄付は銀行振込です。",
        en: "Chiba Prefecture runs one combined relief fund for the August heavy rain and September's Typhoon No. 25. A distribution committee allocates the money, which reaches affected households through their municipalities. It is open until 31 March 2027, by bank transfer.",
      },
      {
        ja: "日本赤十字社も千葉豪雨の義援金を2027年3月31日まで受け付けており、全額が千葉県の義援金配分委員会へ送られます。",
        en: "The Japanese Red Cross also collects relief money for the Chiba heavy rain until 31 March 2027, all of it sent to Chiba Prefecture's distribution committee.",
      },
      {
        ja: "千葉市は、市の被災者へ直接配分する義援金（2026年11月30日まで）と、被災者支援と復旧のための災害支援寄附（ふるさと納税サイト経由、返礼品なし）の両方を受け付けています。",
        en: "Chiba City runs both a relief fund paid directly to its affected residents (until 30 November 2026) and disaster-support donations for recovery through furusato nozei sites (no return gifts).",
      },
    ],
    recipientSlugs: ["chiba-prefecture-rain-typhoon-2026", "jrc-2026-chiba-flood", "chiba-city-2026-flood-gienkin", "chiba-2026-heavy-rain"],
    active: true,
    emoji: "☔",
    campaign: {
      headline: { ja: "千葉の水害の被災地へ", en: "Help flood-hit Chiba" },
      picks: [
        { slug: "chiba-prefecture-rain-typhoon-2026", label: { ja: "千葉県の義援金を送る", en: "Give to Chiba Prefecture's relief fund" } },
        { slug: "chiba-2026-heavy-rain", label: { ja: "千葉市に寄附する（ふるさと納税）", en: "Donate to Chiba City" } },
      ],
    },
  },
  {
    slug: "august-2026-heavy-rain",
    name: { ja: "令和8年8月大雨・台風第25号（神奈川・石川・福井）", en: "August 2026 Heavy Rain and Typhoon No. 25 (Kanagawa, Ishikawa, Fukui)" },
    since: "2026-08-27",
    area: { ja: "神奈川県・石川県（羽咋市など）・福井県", en: "Kanagawa, Ishikawa (Hakui and more) and Fukui prefectures" },
    summary: {
      ja: "令和8年8月の大雨と台風第25号で被災した神奈川県・石川県・福井県への寄付の公式窓口です。千葉県は別のページにまとめています。",
      en: "Official donation pages for Kanagawa, Ishikawa and Fukui after the August 2026 heavy rain and Typhoon No. 25. Chiba has its own page.",
    },
    body: [
      {
        ja: "8月の大雨は石川県・福井県に、台風第25号は神奈川県に被害をもたらしました。県と共同募金会は義援金を、羽咋市はふるさと納税サイトを通じた災害支援寄付を受け付けています。",
        en: "The August heavy rain hit Ishikawa and Fukui, and Typhoon No. 25 hit Kanagawa. The prefecture and community chests collect relief funds, and Hakui accepts disaster-support donations through furusato nozei sites.",
      },
      {
        ja: "義援金には受付期間があります（神奈川県は2027年3月31日まで、石川県共同募金会は2027年1月29日まで、福井県共同募金会は2026年11月30日まで）。",
        en: "Relief funds have deadlines: Kanagawa until 31 March 2027, the Ishikawa Community Chest until 29 January 2027, and the Fukui Community Chest until 30 November 2026.",
      },
    ],
    recipientSlugs: [
      "kanagawa-prefecture-typhoon-25-2026",
      "akaihane-ishikawa-august-rain-2026",
      "hakui-2026-heavy-rain",
      "akaihane-fukui-august-rain-2026",
    ],
    active: true,
    emoji: "⛈️",
  },
  {
    slug: "nepal-2026-floods",
    name: { ja: "2026年ネパール洪水・土石流", en: "2026 Nepal Floods and Debris Flows" },
    since: "2026-08-26",
    area: { ja: "ネパール中部・北部", en: "Central and northern Nepal" },
    summary: {
      ja: "2026年8月のネパールの洪水・土石流の被災者を支援する、日本の団体の寄付窓口です。",
      en: "Japanese organisations supporting people affected by the floods and debris flows in Nepal in August 2026.",
    },
    body: [
      {
        ja: "2026年8月26日、ネパール中部で大規模な土石流が起き、北部でも洪水と土石流の被害が出ました。日本から寄付できる窓口として、ジャパン・プラットフォーム、CWS Japan、日本赤十字社があります。",
        en: "A large debris flow struck central Nepal on 26 August 2026, and floods and debris flows also hit the north. You can give from Japan through Japan Platform, CWS Japan and the Japanese Red Cross.",
      },
      {
        ja: "日本赤十字社の救援金の受付は2026年11月30日までです。",
        en: "The Japanese Red Cross appeal is open until 30 November 2026.",
      },
    ],
    recipientSlugs: ["jpf-nepal-debris-flow-2026", "cws-japan-nepal-floods-2026", "jrc-nepal-floods-2026"],
    active: true,
    emoji: "🏔️",
  },
  {
    slug: "noto-recovery",
    name: { ja: "能登半島地震からの復興", en: "Noto Peninsula Earthquake Recovery" },
    since: "2024-01-01",
    area: { ja: "石川県能登地方（珠洲市・七尾市・輪島市など）", en: "Noto, Ishikawa Prefecture (Suzu, Nanao, Wajima and more)" },
    summary: {
      ja: "能登半島地震と奥能登豪雨からの復興を支える、自治体と地元の団体の寄付窓口です。",
      en: "Municipalities and local organisations supporting Noto's recovery from the 2024 earthquake and the Oku-Noto heavy rain.",
    },
    body: [
      {
        ja: "2024年1月1日の能登半島地震と、同じ年の奥能登豪雨から、能登の復興は今も続いています。自治体の義援金・寄附金のほか、地元で活動する団体への寄付ができます。",
        en: "Noto is still rebuilding after the earthquake of 1 January 2024 and the Oku-Noto heavy rain later that year. You can give to municipal relief funds or to organisations working locally.",
      },
    ],
    recipientSlugs: ["suzu-noto", "nanao-noto-gienkin", "bussien", "hokuriku-mirai-kikin"],
    active: false,
    emoji: "🌅",
  },
];

export function getDisaster(slug: string): Disaster | undefined {
  return disasters.find((d) => d.slug === slug);
}

export function disasterRecipients(d: Disaster): Recipient[] {
  return d.recipientSlugs
    .map((s) => recipients.find((r) => r.slug === s))
    .filter((r): r is Recipient => Boolean(r))
    .sort(byPriority);
}

/** The disaster guide a recipient belongs to, if any. */
export function disasterFor(slug: string): Disaster | undefined {
  return disasters.find((d) => d.recipientSlugs.includes(slug));
}
