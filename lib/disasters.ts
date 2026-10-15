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
  },
  {
    slug: "august-2026-heavy-rain",
    name: { ja: "令和8年8月豪雨・台風第25号", en: "August 2026 Heavy Rain and Typhoon No. 25" },
    since: "2026-08-13",
    area: { ja: "千葉県・神奈川県・石川県・福井県", en: "Chiba, Kanagawa, Ishikawa and Fukui prefectures" },
    summary: {
      ja: "令和8年8月の豪雨と台風第25号の被災地へ寄付できる、県・市・共同募金会の公式窓口です。",
      en: "Official donation pages of prefectures, cities and community chests after the August 2026 heavy rain and Typhoon No. 25.",
    },
    body: [
      {
        ja: "8月の大雨は千葉県・石川県・福井県に、台風第25号は千葉県や神奈川県に被害をもたらしました。県と共同募金会は義援金を、千葉市と羽咋市はふるさと納税サイトを通じた災害支援寄付を受け付けています。",
        en: "The August heavy rain hit Chiba, Ishikawa and Fukui, and Typhoon No. 25 hit Chiba and Kanagawa. The prefectures and community chests collect relief funds, while Chiba City and Hakui accept disaster-support donations through furusato nozei sites.",
      },
      {
        ja: "県や共同募金会の義援金は、受付期間が決まっています（千葉県・神奈川県は2027年3月31日まで、石川県共同募金会は2027年1月29日まで、福井県共同募金会は2026年11月30日まで）。",
        en: "Relief funds have deadlines: Chiba and Kanagawa until 31 March 2027, the Ishikawa Community Chest until 29 January 2027, and the Fukui Community Chest until 30 November 2026.",
      },
    ],
    recipientSlugs: [
      "chiba-prefecture-rain-typhoon-2026",
      "chiba-2026-heavy-rain",
      "kanagawa-prefecture-typhoon-25-2026",
      "akaihane-ishikawa-august-rain-2026",
      "hakui-2026-heavy-rain",
      "akaihane-fukui-august-rain-2026",
    ],
    active: true,
    emoji: "☔",
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
