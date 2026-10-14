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

const content: Record<Locale, { title: string; intro: string; who: string[]; need: string[]}> = {
  ja: {
    title: "寄付先として掲載を希望する団体の方へ",
    intro: "掲載は無料です。審査のうえ、寄付金が団体の口座に直接入金される仕組みをご用意します。",
    who: ["日本国内の社会福祉法人・NPO法人・公益法人などの福祉施設", "日本国内で災害支援を行うNPO法人・社会福祉協議会などの法人", "地方自治体・海外の団体は、公式の寄付窓口へのリンクとして無料で掲載します（当サイトでの決済は行いません）", "個人への寄付は受け付けていません"],
    need: ["団体の登記情報または設置根拠", "代表者の本人確認書類", "寄付金の使い道と報告方法", "Stripe アカウントの作成（入金先口座の登録）"],
  },
  en: {
    title: "For organisations",
    intro: "Listing is free. After review, we set you up so donations are paid directly into your own account.",
    who: ["Welfare facilities in Japan run by registered legal entities (social welfare corporations, NPOs, public interest corporations)", "Legal entities in Japan providing disaster relief", "Local governments and overseas organisations are listed free of charge as links to their official donation pages (no payment on this site)", "We do not accept donations to individuals"],
    need: ["Registration documents for the organisation", "Identity documents for the representative", "How funds will be used and reported", "A Stripe account to receive payouts"],
  },
};

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
      {acceptsApplications() ? (
        <ApplyForm locale={locale} />
      ) : (
        <p className="notice">
          {locale === "ja"
            ? "掲載のご相談は、下記のメールアドレスまでご連絡ください。"
            : "To apply, please contact us at the email address below."}
        </p>
      )}
      <p className="apply-contact">
        {locale === "ja" ? "お問い合わせ：" : "Contact: "}
        <a href={`mailto:${operator.email}`}>{operator.email}</a>
      </p>
    </div>
  );
}
