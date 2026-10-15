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
  /** Optional sub-groups (e.g. by region) shown as separate grids; slugs must be in recipientSlugs. */
  groups?: { label: Localized; slugs: string[] }[];
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
  {
    slug: "childrens-homes",
    name: { ja: "全国の児童養護施設", en: "Children's Homes across Japan" },
    summary: {
      ja: "親と暮らせない子どもたちが生活する、全国の児童養護施設への寄付先です。施設や運営法人の公式ページで、寄付の受付を確かめたところだけを載せています。",
      en: "Children's homes across Japan caring for children who cannot live with their parents. We list only homes whose own official pages invite donations.",
    },
    body: [
      {
        ja: "児童養護施設は、虐待や家庭の事情で親と暮らせない子どもたちが生活する施設で、多くは社会福祉法人が運営しています。寄付は子どもたちの生活や行事、進学や自立の費用、施設を巣立った若者への支援などに使われます。",
        en: "Children's homes care for children who cannot live with their families because of abuse or other circumstances; most are run by social welfare corporations. Gifts fund daily life and activities, education and independence costs, and support for young people who have left care.",
      },
      {
        ja: "寄付の方法は施設ごとに違います。オンラインで寄付できる施設のほか、銀行・郵便振込や、先に電話や申込書で連絡してから寄付する施設もあります。各施設のページでご確認ください。",
        en: "How to give differs by home: some take online payments, others bank or postal transfers, and some ask you to contact them first. Please check each home's page.",
      },
    ],
    recipientSlugs: [],
    groups: [
      { label: { ja: "北海道・東北", en: "Hokkaido and Tohoku" }, slugs: ["iwanai-kouseien-hokkaido", "kurumi-gakuen-hakodate", "fuji-seiboen-aomori", "seikou-gakuen-iwate", "sayurien-sendai", "yamagata-gakuen-yamagata", "shirakawa-gakuen-fukushima"] },
      { label: { ja: "関東", en: "Kanto" }, slugs: ["runbini-ibaraki", "francisco-no-machi-gunma", "kodomo-no-machi-saitama", "nonohana-no-ie-chiba", "chiba-care-leaver-scholarship", "tokyo-ikuseien-tokyo", "meguro-wakabaryo-tokyo", "seishonen-fukushi-center-tokyo", "kodomo-no-sono-chigasaki", "seikou-gakuen-zama"] },
      { label: { ja: "中部", en: "Chubu" }, slugs: ["niigata-tenshien-niigata", "lunbinien-toyama", "rinshoen-kanazawa", "clover-gakuen-yamanashi", "iiyama-gakuen-nagano", "shumpuryo-shizuoka", "kawana-rinkai-gakuen-shizuoka", "umegaoka-gakuen-aichi"] },
      { label: { ja: "近畿", en: "Kinki" }, slugs: ["moriyama-gakuen-shiga", "kyoto-seieikai-kyoto", "uminoko-gakuen-osaka", "shinai-gakuen-hyogo"] },
      { label: { ja: "中国・四国", en: "Chugoku and Shikoku" }, slugs: ["tottori-kodomo-gakuen-tottori", "shintenchi-ikujiin-okayama", "kobushigaoka-gakuen-hiroshima", "kameyama-gakuen-kagawa"] },
      { label: { ja: "九州・沖縄", en: "Kyushu and Okinawa" }, slugs: ["wakamatsu-jido-home-fukuoka", "fukuoka-ikujiin-fukuoka", "wakatake-no-ie-nagasaki", "jiaien-childrens-home-kumamoto", "fujisakidai-doen-kumamoto", "sayuri-home-oita", "shimazoe-no-oka-okinawa"] },
    ],
    emoji: "🏠",
  },
];

// A grouped theme lists every grouped slug.
for (const t of themes) if (t.groups && t.recipientSlugs.length === 0) t.recipientSlugs = t.groups.flatMap((g) => g.slugs);

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
