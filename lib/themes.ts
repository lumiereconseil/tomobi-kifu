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
      ja: "経済的に苦しい家庭やひとり親家庭の子ども、親を頼れない子ども、不登校やひきこもりに悩む10代・若者を支える団体への寄付先です。",
      en: "Organisations supporting children from low-income and single-parent families, young people who cannot rely on their parents, and teenagers and young adults facing school refusal or isolation.",
    },
    body: [
      {
        ja: "学習支援、居場所づくり、施設や里親のもとを巣立つ若者の自立支援など、子どもたちの将来を支える団体です。北海道から沖縄まで、地域で活動する団体も載せています。",
        en: "These organisations provide learning support, safe places and help for young people leaving care, from Hokkaido to Okinawa.",
      },
    ],
    recipientSlugs: [
      "kidsdoor",
      "katariba",
      "dxp",
      "sodateage-net",
      "single-mothers-forum",
      "bridge-for-smile",
      "sos-childrens-villages-japan",
      "storia",
      "asuiku",
      "kacotam",
      "mirai-fund-okinawa",
    ],
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
    recipientSlugs: ["second-harvest-japan", "musubie", "foodbank-kansai", "second-harvest-nagoya", "foodbank-yamaguchi", "houboku"],
    emoji: "🍙",
  },
  {
    slug: "illness-disability",
    name: { ja: "病気・障害・高齢の方と家族の支援", en: "Illness, Disability, Old Age and Families" },
    summary: {
      ja: "重い病気と闘う子どもと家族、医療的ケアが必要な子ども、障害のある人、高齢の方の暮らしを支える団体への寄付先です。",
      en: "Organisations supporting children with serious illness and their families, children who need medical care at home, people with disabilities, and older people.",
    },
    body: [
      {
        ja: "入院中の子どもと家族の滞在施設やキャンプ、医療的ケア児の家族の支援、盲導犬の育成、被災した障害のある人への支援、地域の助け合いづくりなど、医療と暮らしの両面から支える団体です。",
        en: "They run family houses and camps for children in hospital, support families of children who need medical care, train guide dogs, help disabled people hit by disasters and build community mutual aid.",
      },
    ],
    recipientSlugs: [
      "shine-on-kids",
      "ronald-mcdonald-house-japan",
      "solaputi-kids-camp",
      "gold-ribbon",
      "unleash",
      "jdss",
      "yumekaze-kikin",
      "japan-guide-dog-association",
      "sawayaka-welfare-foundation",
    ],
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
