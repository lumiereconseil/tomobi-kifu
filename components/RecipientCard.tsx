import Link from "next/link";
import { formatMoney } from "@/lib/donation";
import type { Dictionary, Locale } from "@/lib/i18n";
import { isDirect, type Recipient } from "@/lib/recipients";
import { Progress } from "./Progress";

export function RecipientCard({ r, locale, t }: { r: Recipient; locale: Locale; t: Dictionary }) {
  return (
    <Link href={`/${locale}/recipients/${r.slug}`} className="card">
      <div className={`card-banner cat-${r.category}`} aria-hidden>
        {r.emoji}
      </div>
      <div className="card-body">
        <div className="tags">
          {r.emergency && <span className="tag tag-emergency">{t.emergencyBadge}</span>}
          <span className={`tag cat-${r.category}`}>{t.categories[r.category]}</span>
          <span className="tag">{r.country[locale]}</span>
          <span className={isDirect(r) ? "tag tag-direct" : "tag tag-external"}>
            {isDirect(r) ? t.payHere : `${t.payExternal} ↗`}
          </span>
          {r.sample && <span className="tag tag-sample">{t.sample}</span>}
        </div>
        <h3>{r.name[locale]}</h3>
        <p className="muted">{r.summary[locale]}</p>
        {r.matching && <p className="small matching-mini">🤝 {t.matching(r.matching.sponsor[locale])}</p>}
        {isDirect(r) && (
          <>
            <Progress raised={r.raisedJpy} goal={r.goalJpy} />
            <p className="small">
              <strong>{formatMoney(r.raisedJpy, "jpy", locale)}</strong> / {t.goal}{" "}
              {formatMoney(r.goalJpy, "jpy", locale)}
            </p>
          </>
        )}
      </div>
    </Link>
  );
}
