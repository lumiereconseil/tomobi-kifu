import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplyForm } from "@/components/ApplyForm";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { acceptsApplications, operator } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? pageMetadata(locale, "/apply", { title: getDictionary(locale).apply }) : {};
}

const content: Record<Locale, { title: string; intro: string; who: string[]; need: string[]; flow: string[] }> = {
  ja: {
    title: "寄付先として掲載を希望する団体の方へ",
    intro: "掲載は無料です。審査のうえ、寄付金が団体の口座に直接入金される仕組みをご用意します。",
    who: ["日本国内の社会福祉法人・NPO法人・公益法人などの福祉施設", "日本国内で災害支援を行うNPO法人・社会福祉協議会などの法人", "地方自治体・海外の団体は、公式の寄付窓口へのリンクとして無料で掲載します（当サイトでの決済は行いません）", "個人への寄付は受け付けていません"],
    need: ["団体の登記情報または設置根拠", "代表者の本人確認書類", "寄付金の使い道と報告方法", "Stripe アカウントの作成（入金先口座の登録）"],
    flow: [
      "団体のページに「毎月寄付」「1回寄付」のボタンを設置します。決済は Stripe（世界的な決済会社）の画面で行います。",
      "寄付金は Stripe から団体の口座へ直接入金されます。当サイトの運営者が寄付金を預かることはありません。",
      "事務手数料は寄付額の10%（災害の緊急支援は5%）で、カード決済手数料もこの中に含まれます。掲載料・月額料金はかかりません。",
      "寄付金控除の領収書は、対象となる法人の場合、団体から寄付者へ発行してください。",
      "掲載の停止はいつでもご連絡ひとつで行います。",
    ],
  },
  en: {
    title: "For organisations",
    intro: "Listing is free. After review, we set you up so donations are paid directly into your own account.",
    who: ["Welfare facilities in Japan run by registered legal entities (social welfare corporations, NPOs, public interest corporations)", "Legal entities in Japan providing disaster relief", "Local governments and overseas organisations are listed free of charge as links to their official donation pages (no payment on this site)", "We do not accept donations to individuals"],
    need: ["Registration documents for the organisation", "Identity documents for the representative", "How funds will be used and reported", "A Stripe account to receive payouts"],
    flow: [
      "We add monthly and one-time donate buttons to your page. Payment is handled on Stripe's secure page.",
      "Donations are paid by Stripe straight into your own account. The site operator never holds donated funds.",
      "The administrative fee is 10% of each gift (5% for disaster emergency appeals), card processing included. There is no listing or monthly fee.",
      "Tax receipts, where applicable, are issued by your organisation to the donor.",
      "You can ask us to remove your listing at any time.",
    ],
  },
};

const mailTemplate: Record<Locale, { subject: string; body: string[] }> = {
  ja: {
    subject: "【ともに寄付】掲載申込",
    body: ["団体名：", "法人の種類（社会福祉法人・NPO法人・自治体など）：", "所在地：", "担当者名：", "電話番号：", "ウェブサイト：", "公式の寄付ページのURL（あれば）：", "寄付金の使い道と報告方法：", "", "※当サイトに掲載している団体の情報の訂正・掲載停止のご依頼もこちらからどうぞ。"],
  },
  en: {
    subject: "[Give Together] Listing application",
    body: ["Organisation name:", "Legal form (social welfare corporation, NPO, local government, etc.):", "Address:", "Contact name:", "Phone:", "Website:", "Official donation page URL (if any):", "How funds will be used and reported:", "", "You can also use this address to correct or remove an existing listing."],
  },
};

function applyMailto(locale: Locale): string {
  const m = mailTemplate[locale];
  return `mailto:${operator.email}?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.body.join("\n"))}`;
}

export default async function Apply({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = content[locale];
  return (
    <div className="container section prose">
      <h1>{c.title}</h1>
      <p className="lead">{c.intro}</p>
      <h2>{locale === "ja" ? "対象" : "Who can apply"}</h2>
      <ul>{c.who.map((w) => <li key={w}>{w}</li>)}</ul>
      <h2>{locale === "ja" ? "必要なもの" : "What you need"}</h2>
      <ul>{c.need.map((n) => <li key={n}>{n}</li>)}</ul>
      <h2>{locale === "ja" ? "お金の流れと手数料" : "How donations and fees work"}</h2>
      <ul>{c.flow.map((f) => <li key={f}>{f}</li>)}</ul>
      {acceptsApplications() ? (
        <ApplyForm locale={locale} />
      ) : (
        <div className="panel apply-mail">
          <h2>{locale === "ja" ? "メールで申し込む" : "Apply by email"}</h2>
          <p>
            {locale === "ja"
              ? "下のボタンを押すと、記入項目の入ったメールが開きます。埋めて送ってください。内容を確認してご連絡します。"
              : "The button opens an email with the questions filled in. Complete it and send it, and we will get back to you after reviewing it."}
          </p>
          <a className="btn btn-primary" href={applyMailto(locale)}>
            {locale === "ja" ? "申込メールを作成する" : "Write the application email"}
          </a>
        </div>
      )}
      <p className="apply-contact">
        {locale === "ja" ? "お問い合わせ：" : "Contact: "}
        <a href={`mailto:${operator.email}`}>{operator.email}</a>
      </p>
    </div>
  );
}
