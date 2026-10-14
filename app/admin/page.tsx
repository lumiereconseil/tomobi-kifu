import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Progress } from "@/components/Progress";
import { ADMIN_COOKIE, isAdmin } from "@/lib/admin";
import { createOnboardingLink } from "@/lib/connect";
import { getStore, type ApplicationStatus } from "@/lib/db";
import { formatMoney, platformFeePercent } from "@/lib/donation";
import { getRecipient } from "@/lib/recipients";

export const dynamic = "force-dynamic";

/** Monthly donation target (Masa, 2026-10-13): ¥10M+/month → ¥1M+ in fees. */
const MONTHLY_GOAL_JPY = 10_000_000;
/** Approximate Stripe card fee in Japan, paid by the platform out of its fee. */
const STRIPE_FEE_PERCENT = 3.6;

const statusLabel: Record<ApplicationStatus, string> = {
  pending: "審査待ち",
  approved: "承認済み",
  rejected: "却下",
};

function startOfMonthJst(now = new Date()): Date {
  const jst = new Date(now.getTime() + 9 * 3600_000);
  return new Date(Date.UTC(jst.getUTCFullYear(), jst.getUTCMonth(), 1) - 9 * 3600_000);
}

async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

async function approve(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = Number(formData.get("id"));
  const store = getStore();
  const app = await store.getApplication(id);
  if (!app) redirect("/admin?error=not_found");
  await store.setApplicationStatus(id, "approved");
  let url: string;
  try {
    url = (await createOnboardingLink(app, "ja")).url;
  } catch (err) {
    console.error("onboarding link failed", err);
    redirect(`/admin?error=stripe&app=${id}`);
  }
  redirect(`/admin?app=${id}&link=${encodeURIComponent(url)}`);
}

async function reject(formData: FormData) {
  "use server";
  await requireAdmin();
  await getStore().setApplicationStatus(Number(formData.get("id")), "rejected");
  revalidatePath("/admin");
}

async function logout() {
  "use server";
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin/login");
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ app?: string; link?: string; error?: string }>;
}) {
  await requireAdmin();
  const { app: linkApp, link, error } = await searchParams;
  const store = getStore();
  const since = startOfMonthJst();
  const [month, applications] = await Promise.all([store.summarySince(since), store.listApplications()]);

  const fee = platformFeePercent();
  const feeJpy = month.feeJpy;
  const netJpy = Math.round(feeJpy - (month.donationsJpy * STRIPE_FEE_PERCENT) / 100);
  const yen = (n: number) => formatMoney(n, "jpy", "ja");
  const pending = applications.filter((a) => a.status === "pending").length;

  return (
    <>
      <div className="admin-head">
        <h1>管理画面</h1>
        <form action={logout}>
          <button className="btn btn-ghost" type="submit">ログアウト</button>
        </form>
      </div>
      {!process.env.DATABASE_URL && (
        <p className="notice">DATABASE_URL が未設定のため、データはメモリ上にあり再起動で消えます。</p>
      )}

      <h2>今月の実績（{since.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}〜）</h2>
      <div className="kpis">
        <div className="kpi">
          <span>寄付額</span>
          <strong>{yen(month.donationsJpy)}</strong>
        </div>
        <div className="kpi">
          <span>事務手数料（通常 {fee}%）</span>
          <strong>{yen(feeJpy)}</strong>
        </div>
        <div className="kpi">
          <span>手取り見込み（決済手数料 約{STRIPE_FEE_PERCENT}% 控除後）</span>
          <strong>{yen(netJpy)}</strong>
        </div>
        <div className="kpi">
          <span>寄付件数（うち毎月）</span>
          <strong>
            {month.count}（{month.monthlyCount}）
          </strong>
        </div>
      </div>
      <p className="small muted">月間目標 {yen(MONTHLY_GOAL_JPY)} に対する進捗</p>
      <Progress raised={month.donationsJpy} goal={MONTHLY_GOAL_JPY} />

      {month.byRecipient.length > 0 && (
        <table className="info-table admin-table">
          <thead>
            <tr>
              <th>寄付先</th>
              <th>寄付額</th>
              <th>件数</th>
            </tr>
          </thead>
          <tbody>
            {month.byRecipient.map((r) => (
              <tr key={r.slug}>
                <td>{getRecipient(r.slug)?.name.ja ?? r.slug}</td>
                <td>{yen(r.donationsJpy)}</td>
                <td>{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>掲載申請（審査待ち {pending} 件）</h2>
      {error === "stripe" && <p className="error">Stripe の口座作成に失敗しました。ログを確認してください。</p>}
      {link && (
        <div className="notice">
          <p>
            申請 #{linkApp} の口座登録リンクを発行しました。団体の担当者に送ってください（有効期限があります。切れたら再発行できます）。
          </p>
          <input className="link-box" readOnly value={link} />
        </div>
      )}
      {applications.length === 0 ? (
        <p className="muted">申請はまだありません。</p>
      ) : (
        <div className="applications">
          {applications.map((a) => (
            <article key={a.id} className="application">
              <div className="supporter-head">
                <strong>
                  #{a.id} {a.orgName}
                </strong>
                <span className={`tag status-${a.status}`}>{statusLabel[a.status]}</span>
              </div>
              <p className="small muted">
                {a.category} · {a.country} · {a.contactName} &lt;{a.email}&gt;
                {a.website && (
                  <>
                    {" · "}
                    <a href={a.website} target="_blank" rel="noopener noreferrer">
                      {a.website}
                    </a>
                  </>
                )}{" "}
                · {a.createdAt.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}
              </p>
              <p>{a.description}</p>
              {a.stripeAccountId && <p className="small">Stripe: {a.stripeAccountId}</p>}
              {a.status !== "rejected" && (
                <div className="hero-actions">
                  <form action={approve}>
                    <input type="hidden" name="id" value={a.id} />
                    <button className="btn btn-primary" type="submit">
                      {a.status === "approved" ? "登録リンクを再発行" : "承認して口座登録リンクを発行"}
                    </button>
                  </form>
                  {a.status === "pending" && (
                    <form action={reject}>
                      <input type="hidden" name="id" value={a.id} />
                      <button className="btn btn-ghost" type="submit">却下</button>
                    </form>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
      <p className="small muted">
        承認後、団体が Stripe の登録を終えたら、発行された acct_... を lib/recipients.ts の stripeAccountId に設定して掲載します。
      </p>
    </>
  );
}
