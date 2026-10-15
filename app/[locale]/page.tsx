import Link from "next/link";
import { notFound } from "next/navigation";
import { RecipientCard } from "@/components/RecipientCard";
import { formatMoney } from "@/lib/donation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { disasterRecipients, disasters } from "@/lib/disasters";
import { themes } from "@/lib/themes";
import { isDirect, type Category, type Region } from "@/lib/recipients";
import { homeJsonLd } from "@/lib/seo";
import { recipientsWithStats } from "@/lib/stats";

const categories: Category[] = ["disaster", "welfare", "municipality"];
const regions: Region[] = ["japan", "world"];

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cat?: string; region?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const { cat, region } = await searchParams;
  const recipients = await recipientsWithStats();
  const campaigns = disasters.filter((d) => d.campaign);
  // Campaign appeals (Kumamoto, Chiba) lead the emergency list.
  const featured = new Set(campaigns.flatMap((d) => d.recipientSlugs));
  const emergencies = [...recipients.filter((r) => r.emergency && featured.has(r.slug)), ...recipients.filter((r) => r.emergency && !featured.has(r.slug))];

  const list = recipients.filter(
    (r) => (!cat || r.category === cat) && (!region || r.region === region),
  );
  // Only gifts made on this site are counted; external pages keep their own totals.
  const direct = recipients.filter(isDirect);
  const total = direct.reduce((s, r) => s + r.raisedJpy, 0);
  const supporters = direct.reduce((s, r) => s + r.supporters, 0);

  const href = (next: { cat?: string; region?: string }) => {
    const q = new URLSearchParams();
    const c = "cat" in next ? next.cat : cat;
    const g = "region" in next ? next.region : region;
    if (c) q.set("cat", c);
    if (g) q.set("region", g);
    const s = q.toString();
    return `/${locale}${s ? `?${s}` : ""}#recipients`;
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd(locale)).replace(/</g, "\\u003c") }}
      />
      <section className="hero">
        <div className="container">
          <p className="hero-kicker">{t.tagline}</p>
          <h1>{t.campaignTitle}</h1>
          <p className="lead">{t.campaignLead}</p>
          <div className="campaigns">
            {campaigns.map((d) => (
              <div key={d.slug} className="campaign">
                <h2>
                  <span aria-hidden>{d.emoji}</span> {d.campaign!.headline[locale]}
                </h2>
                <p className="small muted">
                  {d.name[locale]} · {t.campaignCount(disasterRecipients(d).length)}
                </p>
                <div className="campaign-picks">
                  {d.campaign!.picks.map((p) => {
                    const r = recipients.find((x) => x.slug === p.slug);
                    if (!r || r.payment.mode !== "external") return null;
                    return (
                      <a key={p.slug} href={r.payment.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        {p.label[locale]} ↗
                      </a>
                    );
                  })}
                </div>
                <Link href={`/${locale}/disasters/${d.slug}`} className="campaign-more">
                  {t.campaignMore(disasterRecipients(d).length)} →
                </Link>
              </div>
            ))}
          </div>
          <p className="small muted">{t.campaignNote}</p>
          <div className="hero-actions">
            <Link href="#recipients" className="btn btn-ghost">
              {t.browse}
            </Link>
            <Link href={`/${locale}/how-it-works`} className="btn btn-ghost">
              {t.howItWorks}
            </Link>
          </div>
          {total > 0 && (
          <dl className="stats">
            <div>
              <dt>{t.raised}</dt>
              <dd>{formatMoney(total, "jpy", locale)}</dd>
            </div>
            <div>
              <dt>{t.supporterCount}</dt>
              <dd>{supporters.toLocaleString(locale)}</dd>
            </div>
          </dl>
          )}
        </div>
      </section>

      <section className="container section disaster-strip">
        <h2>{t.byDisaster}</h2>
        <div className="disaster-links">
          {disasters.map((d) => (
            <Link key={d.slug} href={`/${locale}/disasters/${d.slug}`} className="disaster-link">
              <span aria-hidden>{d.emoji}</span>
              <span>
                <strong>{d.name[locale]}</strong>
                <small>{d.area[locale]}</small>
              </span>
            </Link>
          ))}
          <Link href={`/${locale}/guide`} className="disaster-link guide-link">
            <span aria-hidden>📘</span>
            <span>
              <strong>{t.guide}</strong>
              <small>{t.guideSub}</small>
            </span>
          </Link>
        </div>
        <h2 className="cause-heading">{t.byCause}</h2>
        <div className="disaster-links">
          {themes.map((c) => (
            <Link key={c.slug} href={`/${locale}/causes/${c.slug}`} className="disaster-link">
              <span aria-hidden>{c.emoji}</span>
              <span>
                <strong>{c.name[locale]}</strong>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {recipients.some((r) => r.emergency) && (
        <section className="container section emergency-section">
          <h2>🚨 {t.emergencyHome}</h2>
          <div className="grid">
            {emergencies.map((r) => (
                <RecipientCard key={r.slug} r={r} locale={locale} t={t} />
              ))}
          </div>
        </section>
      )}

      <section id="recipients" className="container section">
        {recipients.some((r) => r.sample) && <p className="notice">{t.sampleNotice}</p>}
        {recipients.some((r) => r.partner === false) && <p className="notice">{t.referralNotice}</p>}
        <div className="filters">
          <div className="chips">
            <Link href={href({ cat: undefined })} className={!cat ? "chip active" : "chip"}>
              {t.all}
            </Link>
            {categories.map((c) => (
              <Link key={c} href={href({ cat: c })} className={cat === c ? "chip active" : "chip"}>
                {t.categories[c]}
              </Link>
            ))}
          </div>
          <div className="chips">
            <Link href={href({ region: undefined })} className={!region ? "chip active" : "chip"}>
              {t.all}
            </Link>
            {regions.map((g) => (
              <Link key={g} href={href({ region: g })} className={region === g ? "chip active" : "chip"}>
                {t.regions[g]}
              </Link>
            ))}
          </div>
        </div>
        {[
          { key: "japan", title: t.sectionJapan, items: list.filter((r) => r.region === "japan" && !(r.emergency && !cat && !region)) },
          { key: "world", title: t.sectionWorld, items: list.filter((r) => r.region === "world" && !(r.emergency && !cat && !region)) },
        ]
          .filter((s) => s.items.length > 0)
          .map((s) => (
            <div key={s.key} className="region-block">
              <h2>{s.title}</h2>
              <div className="grid">
                {s.items.map((r) => (
                  <RecipientCard key={r.slug} r={r} locale={locale} t={t} />
                ))}
              </div>
            </div>
          ))}
      </section>
    </>
  );
}
