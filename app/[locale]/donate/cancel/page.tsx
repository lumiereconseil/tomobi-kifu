import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { getRecipient } from "@/lib/recipients";

export default async function Cancel({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ r?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const { r } = await searchParams;
  const recipient = r ? getRecipient(r) : undefined;

  return (
    <div className="container section center">
      <h1>{t.cancelTitle}</h1>
      <p>{t.cancelBody}</p>
      <div className="hero-actions center-row">
        {recipient && (
          <Link href={`/${locale}/recipients/${recipient.slug}`} className="btn btn-primary">
            {t.tryAgain}
          </Link>
        )}
        <Link href={`/${locale}`} className="btn btn-ghost">
          {t.backHome}
        </Link>
      </div>
    </div>
  );
}
