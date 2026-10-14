import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

const content: Record<
  Locale,
  { title: string; body: string; refreshTitle: string; refreshBody: string; demo: string }
> = {
  ja: {
    title: "Stripe の登録手続きが完了しました",
    body: "ご登録ありがとうございます。Stripe による確認が終わり次第、寄付先として掲載し、寄付金が団体の口座へ直接入金されるようになります。掲載準備ができましたらご連絡します。",
    refreshTitle: "登録リンクの有効期限が切れました",
    refreshBody: "お手数ですが、運営者へご連絡いただき、新しい登録リンクを受け取ってください。",
    demo: "デモモードです。実際の Stripe アカウントは作成されていません。",
  },
  en: {
    title: "Stripe setup complete",
    body: "Thank you. Once Stripe has verified your details, we will list your organisation and donations will be paid directly into your account. We will be in touch when your page is ready.",
    refreshTitle: "This setup link has expired",
    refreshBody: "Please contact us to receive a new Stripe setup link.",
    demo: "Demo mode. No real Stripe account was created.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: content[locale].title } : {};
}

export default async function ApplyConnected({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ demo?: string; refresh?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { demo, refresh } = await searchParams;
  const c = content[locale];
  return (
    <div className="container section center">
      <div className="big-emoji" aria-hidden>
        {refresh ? "⏳" : "✅"}
      </div>
      <h1>{refresh ? c.refreshTitle : c.title}</h1>
      <p>{refresh ? c.refreshBody : c.body}</p>
      {demo && <p className="notice">{c.demo}</p>}
      <Link href={`/${locale}`} className="btn btn-primary">
        {getDictionary(locale).backHome}
      </Link>
    </div>
  );
}
