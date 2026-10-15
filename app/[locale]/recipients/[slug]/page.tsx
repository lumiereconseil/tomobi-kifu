import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DonateForm } from "@/components/DonateForm";
import { disasterFor } from "@/lib/disasters";
import { themeFor } from "@/lib/themes";
import { Progress } from "@/components/Progress";
import { formatMoney, limits, platformFeePercent } from "@/lib/donation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { getStore } from "@/lib/db";
import { getRecipient, isDirect, type Recipient } from "@/lib/recipients";
import { recipientsWithStats } from "@/lib/stats";
import { pageMetadata } from "@/lib/seo";
import { getStripe } from "@/lib/stripe";

// Totals and supporters change with every gift.
export const dynamic = "force-dynamic";

function externalReason(r: Recipient, locale: "ja" | "en"): string {
  const ja = locale === "ja";
  if (r.partner === false && r.region === "japan") {
    return ja
      ? "現在この団体とは提携していないため、団体の公式寄付ページをご案内しています。"
      : "We are not yet partnered with this organisation, so we link to its official donation page.";
  }
  if (r.region === "world") {
    return ja
      ? "海外の団体へは日本の決済サービスから直接送金できないため、海外の寄付プラットフォームを通じて寄付していただきます。"
      : "Payments from Japan cannot be paid out directly to overseas organisations, so gifts go through an international donation platform.";
  }
  if (r.category === "municipality") {
    return ja
      ? "自治体への寄付は公金として扱われるため、自治体の公式窓口から直接寄付していただくのが確実です。"
      : "Gifts to local governments are public funds, so they are best made directly through the government's official page.";
  }
  return ja
    ? "義援金は被災者へ全額公平に配分されるよう、公式の受付窓口から直接寄付していただきます。"
    : "Relief money is distributed in full and fairly to affected people, so it is collected through the official relief fund.";
}

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const r = getRecipient(slug);
  if (!r || !isLocale(locale)) return {};
  return pageMetadata(locale, `/recipients/${slug}`, { title: r.name[locale], description: `${r.summary[locale]} ${r.description[locale]}`.slice(0, 160) });
}

export default async function RecipientPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  if (!getRecipient(slug)) notFound();
  const r = (await recipientsWithStats()).find((x) => x.slug === slug)!;
  const recent = await getStore()
    .recentDonations(slug, 8)
    .catch(() => []);
  const t = getDictionary(locale);
  const demo = !getStripe();
  const fee = platformFeePercent(r.feePercent);
  const disaster = disasterFor(r.slug);
  const cause = themeFor(r.slug);

  const minMax = (c: "jpy" | "usd") =>
    t.minMax(formatMoney(limits[c].min, c, locale), formatMoney(limits[c].max, c, locale));

  return (
    <div className="container section detail">
      <article>
        <div className={`detail-banner cat-${r.category}`} aria-hidden>
          {r.emoji}
        </div>
        <div className="tags">
          <span className={`tag cat-${r.category}`}>{t.categories[r.category]}</span>
          <span className="tag">{r.country[locale]}</span>
          {r.sample && <span className="tag tag-sample">{t.sample}</span>}
        </div>
        {r.emergency && (
          <div className="emergency-banner">
            <strong>{t.emergencyTitle}</strong>
            <span>{isDirect(r) ? t.emergencyBody(fee) : t.emergencyReferralBody}</span>
          </div>
        )}
        <h1>{r.name[locale]}</h1>
        <p className="lead">{r.summary[locale]}</p>
        <p>{r.description[locale]}</p>
        {cause && (
          <p className="disaster-backlink">
            <Link href={`/${locale}/causes/${cause.slug}`}>
              {cause.emoji} {t.causeGuideLink(cause.name[locale])} →
            </Link>
          </p>
        )}
        {disaster && (
          <p className="disaster-backlink">
            <Link href={`/${locale}/disasters/${disaster.slug}`}>
              {disaster.emoji} {t.disasterGuideLink(disaster.name[locale])} →
            </Link>
          </p>
        )}
        {r.matching && (
          <p className="matching">
            🤝 {t.matching(r.matching.sponsor[locale])}
            {r.matching.capJpy != null && t.matchingCap(formatMoney(r.matching.capJpy, "jpy", locale))}
          </p>
        )}
        {r.sample && <p className="notice">{t.sampleNotice}</p>}
        {r.partner === false && <p className="notice">{t.referralDetail}</p>}
        {r.partner === false && (
          <p className="small muted">
            {t.forThisOrg} <Link href={`/${locale}/apply`}>{t.forThisOrgLink}</Link>
          </p>
        )}

        {r.payment.mode === "direct" && (
          <>
            <h2>{t.recentSupporters}</h2>
            {recent.length === 0 ? (
              <p className="muted">{t.noSupportersYet}</p>
            ) : (
              <ul className="supporters">
                {recent.map((d) => (
                  <li key={d.stripeId}>
                    <div className="supporter-head">
                      <strong>{d.anonymous || !d.donorName ? t.anonymousDonor : d.donorName}</strong>
                      <span className="muted small">
                        {formatMoney(d.amount, d.currency as "jpy" | "usd", locale)}
                        {d.monthly && ` / ${t.monthly}`} ·{" "}
                        {d.createdAt.toLocaleDateString(locale === "ja" ? "ja-JP" : "en-US")}
                      </span>
                    </div>
                    {d.message && <p>{d.message}</p>}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </article>

      {r.payment.mode === "external" ? (
        <aside className="panel">
          <h2>{t.externalTitle}</h2>
          <p>{t.externalBody(r.payment.via[locale])}</p>
          <a href={r.payment.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-block">
            {t.externalButton} ↗
          </a>
          <details className="small muted why">
            <summary>{t.externalWhy}</summary>
            <p>{externalReason(r, locale)}</p>
          </details>
        </aside>
      ) : (
        <aside className="panel">
          <Progress raised={r.raisedJpy} goal={r.goalJpy} />
          <p className="raised">
            <strong>{formatMoney(r.raisedJpy, "jpy", locale)}</strong>
            <span className="muted">
              {" "}
              / {t.goal} {formatMoney(r.goalJpy, "jpy", locale)}
            </span>
          </p>
          <p className="muted small">
            {r.supporters.toLocaleString(locale)} {t.supporters}
          </p>
          <h2>{t.donateNow}</h2>
          {demo && <p className="notice">{t.demoNote}</p>}
          <DonateForm
            slug={r.slug}
            locale={locale}
            feePercent={fee}
            labels={{
              amount: t.amount,
              currency: t.currency,
              otherAmount: t.otherAmount,
              frequency: t.frequency,
              once: t.once,
              monthly: t.monthly,
              message: t.message,
              anonymous: t.anonymous,
              proceed: t.proceed,
              processing: t.processing,
              coverFee: t.coverFee,
              breakdown: t.breakdown,
              total: t.total,
              invalidAmount: `${minMax("jpy")} / ${minMax("usd")}`,
              error: locale === "ja" ? "エラーが発生しました。時間をおいて再度お試しください。" : "Something went wrong. Please try again later.",
            }}
          />
          <p className="small muted">{t.feeNote(fee)}</p>
          <p className="small muted">{t.secureNote}</p>
          <p className="small muted">{t.taxNote}</p>
        </aside>
      )}
    </div>
  );
}
