import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).howItWorks } : {};
}

const content: Record<Locale, { title: string; steps: [string, string][]; fees: string[] }> = {
  ja: {
    title: "寄付金の流れ",
    steps: [
      ["1. 寄付先を審査して掲載", "当サイトで寄付を受け付けるのは、審査済みの日本国内の法人（社会福祉法人・NPO法人など）だけです。個人への寄付は扱いません。"],
      ["2. Stripe で安全に決済", "カード情報は決済代行会社 Stripe が処理し、当サイトには保存されません。"],
      ["3. 受取先の口座へ直接入金", "寄付金は Stripe Connect を通じて受取先自身の口座に直接入金されます。運営者が寄付金を預かることはありません。"],
      ["4. 活動を報告", "受取先から寄付金の使い道を報告してもらい、このサイトで公開します。"],
      ["自治体・義援金・海外の寄付先", "これらは各団体の公式窓口（ふるさと納税、日本赤十字社、GlobalGiving など）へご案内します。寄付金は当サイトを経由しません。"],
    ],
    fees: [
      "事務手数料：お支払い額の10%を Lumière Conseil が受け取ります（災害の緊急支援は5%）。カード決済手数料はこの中から Lumière Conseil が負担します。変更する場合は事前にこのページでお知らせします。",
      "手数料の負担：寄付フォームで「事務手数料も負担する」を選ぶと、手数料分を上乗せしてお支払いいただき、選んだ金額が全額受取先に届きます（初期設定はオン。外すこともできます）。",
      "寄付金控除：対象かどうかは受取先によります（自治体・認定NPO法人など）。領収書は受取先から発行されます。",
    ],
  },
  en: {
    title: "Where your money goes",
    steps: [
      ["1. Recipients are vetted", "Only vetted legal entities in Japan (social welfare corporations, NPOs and similar) receive gifts on this site. We do not handle donations to individuals."],
      ["2. Secure payment with Stripe", "Card details are processed by Stripe and never stored on this site."],
      ["3. Paid directly to the recipient", "Donations are paid via Stripe Connect straight into the recipient's own account. The operator never holds donated funds."],
      ["4. Impact reports", "Recipients report how the money was used, and we publish those reports here."],
      ["Local governments, relief funds and overseas causes", "We link you to their official donation pages (furusato nozei, the Japanese Red Cross, GlobalGiving and others). The money does not pass through this site."],
    ],
    fees: [
      "Administrative fee: Lumière Conseil keeps 10% of each payment (5% for disaster emergency appeals). Card processing fees are paid by Lumière Conseil out of this. Any change will be announced on this page in advance.",
      "Covering the fee: if you tick \"add the administrative fee\" on the donation form, the fee is added on top so the recipient receives the full amount you chose (on by default; you can untick it).",
      "Tax deductions: depend on the recipient. Receipts are issued by the recipient.",
    ],
  },
};

export default async function HowItWorks({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = content[locale];
  return (
    <div className="container section prose">
      <h1>{c.title}</h1>
      <ol className="steps">
        {c.steps.map(([h, p]) => (
          <li key={h}>
            <h3>{h}</h3>
            <p>{p}</p>
          </li>
        ))}
      </ol>
      <h2>{locale === "ja" ? "手数料と控除" : "Fees and tax"}</h2>
      <ul>
        {c.fees.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </div>
  );
}
