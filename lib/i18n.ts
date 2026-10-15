export const locales = ["ja", "en"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export type Localized = Record<Locale, string>;

const dict = {
  ja: {
    siteName: "ともに寄付",
    metaTitle: "ともに寄付｜被災地支援・福祉施設への寄付先が見つかる寄付ポータル",
    metaDescription:
      "能登半島地震や令和8年熊本地震の被災自治体、全国の福祉施設・NPOへの寄付先をまとめて探せます。寄付は各団体・自治体の公式窓口へ直接届き、手数料はかかりません。",
    tagline: "まずは日本の被災地と福祉施設へ。そして世界へ。",
    heroLead:
      "被災地の自治体や福祉施設への寄付を、ひとつの場所から探せます。寄付は各団体の公式窓口へ直接届きます。海外の被災国への支援も順次広げていきます。",
    sectionJapan: "日本国内の被災地・福祉施設",
    sectionWorld: "海外の被災地など",
    browse: "寄付先をさがす",
    howItWorks: "寄付金の流れ",
    guide: "寄付の選び方",
    forThisOrg: "この団体の関係者の方へ：掲載内容の訂正・掲載停止、当サイトでの寄付受付のご相談は",
    forThisOrgLink: "こちら",
    guideShort: "寄付の選び方",
    guideSub: "義援金・支援金・ふるさと納税の違い",
    byDisaster: "災害別に寄付先を見る",
    byCause: "テーマで寄付先を見る",
    causeGuideLink: (name: string) => `「${name}」の寄付先をまとめて見る`,
    disasterGuideLink: (name: string) => `${name}の寄付先をまとめて見る`,
    apply: "掲載を希望する団体の方へ",
    legal: "運営者情報・規約",
    all: "すべて",
    categories: {
      municipality: "自治体",
      welfare: "福祉施設",
      disaster: "災害支援",
    },
    regions: { japan: "日本国内", world: "海外" },
    sample: "サンプル",
    referralNotice:
      "現在掲載している団体は、すべて各団体の公式寄付ページへのご案内です。当サイトは各団体と提携しておらず、寄付金を預かることも手数料をいただくこともありません。",
    referralDetail:
      "当サイトはこの団体と提携していません。寄付は団体の公式ページで行われ、当サイトは寄付金を預からず、手数料もいただきません。掲載内容は2026年10月時点の情報です。",
    sampleNotice:
      "現在掲載している寄付先はすべて表示確認用のサンプルです。実在の団体ではありません。",
    raised: "集まった金額",
    goal: "目標",
    supporters: "人が支援",
    supporterCount: "支援者数",
    recentSupporters: "最近の応援",
    anonymousDonor: "匿名の方",
    noSupportersYet: "最初の支援者になりませんか。",
    donateNow: "寄付する",
    amount: "金額",
    currency: "通貨",
    otherAmount: "その他の金額",
    frequency: "寄付の頻度",
    once: "1回のみ",
    monthly: "毎月",
    message: "応援メッセージ（任意）",
    anonymous: "名前を公開しない",
    proceed: "決済に進む",
    processing: "処理中…",
    minMax: (min: string, max: string) => `${min}〜${max}の範囲で入力してください。`,
    secureNote:
      "決済は Stripe の安全な決済画面で行います。カード情報は当サイトに保存されません。",
    taxNote:
      "寄付金控除の対象になるかどうかは受取先によって異なります。領収書は受取先から発行されます。",
    demoNote: "デモモードです。実際の決済は行われません。",
    thanksTitle: "ご寄付ありがとうございます",
    thanksBody:
      "あなたの寄付は受取先へ届けられます。確認メールを Stripe からお送りします。",
    cancelTitle: "寄付は完了していません",
    cancelBody: "決済はキャンセルされました。料金は発生していません。",
    backHome: "トップへ戻る",
    tryAgain: "もう一度試す",
    notFound: "寄付先が見つかりません",
    footer: "日本と世界の「助けたい」をつなぐ寄付プラットフォーム",
    operatedBy: "運営：Lumière Conseil",
    payHere: "このサイトで寄付",
    payExternal: "公式窓口へ",
    externalTitle: "公式窓口から寄付できます",
    externalBody: (via: string) =>
      `この寄付先へは${via}から直接寄付していただきます。寄付金は当サイトを経由しません。`,
    externalButton: "公式窓口で寄付する",
    externalWhy: "なぜ外部の窓口なの？",
    coverFee: "事務手数料（{fee}%）も負担して、選んだ金額を全額届ける",
    breakdown: "お支払い {total}（受取先へ {recipient}、事務手数料 {fee}）",
    total: "合計",
    feeNote: (fee: number) =>
      `お支払い額の${fee}%は事務手数料（決済手数料を含む）として Lumière Conseil が受け取り、残りは受取先の口座へ直接届きます。`,
    emergencyBadge: "緊急支援",
    emergencyTitle: "緊急支援を受付中",
    emergencyBody: (fee: number) => `この寄付先は災害の緊急支援のため、事務手数料を${fee}%に下げています。`,
    emergencyReferralBody: "この災害への寄付を、公式の窓口で受け付けています。",
    emergencyHome: "いま支援が必要な災害",
    matching: (sponsor: string) => `この寄付先への寄付は、${sponsor}が同額を上乗せします。`,
    matchingCap: (cap: string) => `（上限 ${cap}）`,
  },
  en: {
    siteName: "Give Together",
    metaTitle: "Give Together | Find trusted ways to donate to disaster relief and welfare in Japan",
    metaDescription:
      "One place to find official donation pages for disaster-hit towns in Japan (Noto, the 2026 Kumamoto earthquake) and welfare organisations nationwide. Your gift goes straight to each organisation's official page, with no fee.",
    tagline: "Disaster areas and welfare facilities in Japan first. Then the world.",
    heroLead:
      "Find disaster-hit local governments and welfare facilities in Japan in one place. Your gift goes directly to each organisation's official donation page. Support for disaster-hit countries overseas is expanding step by step.",
    sectionJapan: "Disaster areas and welfare facilities in Japan",
    sectionWorld: "Overseas disaster areas and more",
    browse: "Find a cause",
    howItWorks: "Where your money goes",
    guide: "How to give after a disaster",
    forThisOrg: "Are you from this organisation? To correct or remove this listing, or to accept gifts on this site,",
    forThisOrgLink: "contact us",
    guideShort: "Giving guide",
    guideSub: "Relief funds, support funds and furusato nozei",
    byDisaster: "Browse by disaster",
    byCause: "Browse by cause",
    causeGuideLink: (name: string) => `More organisations: ${name}`,
    disasterGuideLink: (name: string) => `All ways to give for the ${name}`,
    apply: "For organisations",
    legal: "Operator & terms",
    all: "All",
    categories: {
      municipality: "Local government",
      welfare: "Welfare facility",
      disaster: "Disaster relief",
    },
    regions: { japan: "Japan", world: "Worldwide" },
    sample: "Sample",
    referralNotice:
      "Every organisation listed here is currently a link to its own official donation page. We are not affiliated with them, never hold the money and take no fee.",
    referralDetail:
      "This site is not affiliated with this organisation. You give on its official page; we never hold the money and take no fee. Information as of October 2026.",
    sampleNotice:
      "All recipients currently listed are samples for preview purposes. They are not real organisations.",
    raised: "Raised",
    goal: "Goal",
    supporters: "supporters",
    supporterCount: "Supporters",
    recentSupporters: "Recent support",
    anonymousDonor: "Anonymous",
    noSupportersYet: "Be the first to give.",
    donateNow: "Donate",
    amount: "Amount",
    currency: "Currency",
    otherAmount: "Other amount",
    frequency: "Frequency",
    once: "One-time",
    monthly: "Monthly",
    message: "Message of support (optional)",
    anonymous: "Donate anonymously",
    proceed: "Continue to payment",
    processing: "Processing…",
    minMax: (min: string, max: string) => `Please enter an amount between ${min} and ${max}.`,
    secureNote:
      "Payment is handled on Stripe's secure checkout. Card details are never stored on this site.",
    taxNote:
      "Tax deductibility depends on the recipient. Receipts are issued by the recipient.",
    demoNote: "Demo mode. No real payment will be made.",
    thanksTitle: "Thank you for your donation",
    thanksBody:
      "Your donation will be delivered to the recipient. Stripe will email you a confirmation.",
    cancelTitle: "Your donation was not completed",
    cancelBody: "The payment was cancelled and you have not been charged.",
    backHome: "Back to home",
    tryAgain: "Try again",
    notFound: "Recipient not found",
    footer: "Connecting donors in Japan and worldwide with causes that need them",
    operatedBy: "Operated by Lumière Conseil",
    payHere: "Give here",
    payExternal: "Official page",
    externalTitle: "Give through the official page",
    externalBody: (via: string) =>
      `Donations to this recipient are made directly through ${via}. The money does not pass through this site.`,
    externalButton: "Donate on the official page",
    externalWhy: "Why an external page?",
    coverFee: "Add the {fee}% administrative fee so the recipient gets the full amount",
    breakdown: "You pay {total} ({recipient} to the recipient, {fee} fee)",
    total: "Total",
    feeNote: (fee: number) =>
      `${fee}% of your payment is kept by Lumière Conseil as an administrative fee (covering card processing); the rest is paid directly to the recipient.`,
    emergencyBadge: "Emergency",
    emergencyTitle: "Emergency appeal",
    emergencyBody: (fee: number) => `This is a disaster emergency appeal, so the administrative fee is reduced to ${fee}%.`,
    emergencyReferralBody: "Donations for this disaster are being accepted at the official page.",
    emergencyHome: "Disasters that need help now",
    matching: (sponsor: string) => `${sponsor} will match every gift to this recipient.`,
    matchingCap: (cap: string) => ` (up to ${cap})`,
  },
};

export type Dictionary = (typeof dict)["ja"];

export function getDictionary(locale: Locale): Dictionary {
  return dict[locale];
}
