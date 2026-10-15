import type { Localized } from "./i18n";
import { byPriority, recipients, type Recipient } from "./recipients";

/** A cause page grouping welfare recipients by theme (children, food, illness and disability). */
export type Theme = {
  slug: string;
  name: Localized;
  summary: Localized;
  body: Localized[];
  /** Listed recipients for this theme, by slug. Unknown slugs are ignored. */
  recipientSlugs: string[];
  emoji: string;
};

export const themes: Theme[] = [
  {
    slug: "children",
    name: { ja: "子どもの貧困・学びの支援", en: "Children in Poverty and Learning Support" },
    summary: {
      ja: "経済的に苦しい家庭の子ども、親を頼れない子ども、不登校や孤立に悩む10代を支える団体への寄付先です。",
      en: "Organisations supporting children from low-income families, young people who cannot rely on their parents, and isolated teenagers.",
    },
    body: [
      {
        ja: "学習支援、居場所づくり、施設や里親のもとを巣立つ若者の自立支援など、子どもたちの将来を支える団体です。北海道から沖縄まで、地域で活動する団体も載せています。",
        en: "These organisations provide learning support, safe places and help for young people leaving care, from Hokkaido to Okinawa.",
      },
    ],
    recipientSlugs: ["kidsdoor", "dxp", "bridge-for-smile", "storia", "kacotam", "mirai-fund-okinawa"],
    emoji: "🎒",
  },
  {
    slug: "food",
    name: { ja: "フードバンク・こども食堂・生活の支援", en: "Food Banks, Children's Cafeterias and Basic Needs" },
    summary: {
      ja: "食べものを必要とする人へ届けるフードバンク、全国のこども食堂、生活に困っている人の自立を支える団体への寄付先です。",
      en: "Food banks, children's cafeterias across Japan, and organisations helping people in hardship get back on their feet.",
    },
    body: [
      {
        ja: "まだ食べられる食品を集めて必要な人や施設に届けるフードバンクや、こども食堂の運営を支える団体です。寄付は食品の保管・配送や、活動の運営に使われます。",
        en: "Food banks collect surplus food and deliver it to people and facilities in need; others support children's cafeterias. Gifts fund storage, delivery and running costs.",
      },
    ],
    recipientSlugs: ["second-harvest-japan", "musubie", "foodbank-kansai", "second-harvest-nagoya", "houboku"],
    emoji: "🍙",
  },
  {
    slug: "illness-disability",
    name: { ja: "病気・障害のある子どもと家族の支援", en: "Children with Illness or Disabilities and Their Families" },
    summary: {
      ja: "小児がんや重い病気と闘う子ども、ダウン症のある人とその家族を支える団体への寄付先です。",
      en: "Organisations supporting children fighting cancer and serious illness, and people with Down syndrome and their families.",
    },
    body: [
      {
        ja: "入院中の子どもと家族へのケア、治療や研究への支援、当事者と家族の相談や交流など、医療と暮らしの両面から支える団体です。",
        en: "They support children in hospital and their families, fund treatment and research, and offer advice and community for people and families.",
      },
    ],
    recipientSlugs: ["shine-on-kids", "gold-ribbon", "jdss"],
    emoji: "💛",
  },
];

export function getTheme(slug: string): Theme | undefined {
  return themes.find((t) => t.slug === slug);
}

export function themeRecipients(t: Theme): Recipient[] {
  return t.recipientSlugs
    .map((s) => recipients.find((r) => r.slug === s))
    .filter((r): r is Recipient => Boolean(r))
    .sort(byPriority);
}

/** The cause page a recipient belongs to, if any. */
export function themeFor(slug: string): Theme | undefined {
  return themes.find((t) => t.recipientSlugs.includes(slug));
}
