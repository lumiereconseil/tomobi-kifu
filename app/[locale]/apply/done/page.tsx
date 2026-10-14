import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

const content: Record<Locale, { title: string; body: string[] }> = {
  ja: {
    title: "申請を受け付けました",
    body: [
      "ご申請ありがとうございます。内容を確認のうえ、ご入力いただいたメールアドレスへご連絡します。",
      "審査が完了すると、寄付金の受取口座を登録するための Stripe の登録リンクをお送りします。",
    ],
  },
  en: {
    title: "Application received",
    body: [
      "Thank you for applying. We will review your application and contact you at the email address you provided.",
      "Once approved, we will send you a Stripe link to set up the account that receives donations.",
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: content[locale].title, robots: { index: false } } : {};
}

export default async function ApplyDone({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = content[locale];
  return (
    <div className="container section center">
      <div className="big-emoji" aria-hidden>
        📨
      </div>
      <h1>{c.title}</h1>
      {c.body.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <Link href={`/${locale}`} className="btn btn-primary">
        {getDictionary(locale).backHome}
      </Link>
    </div>
  );
}
