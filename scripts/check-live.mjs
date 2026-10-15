// Read-only check before switching Stripe to live mode. Changes nothing in Stripe.
// Usage: node --env-file=.env.production scripts/check-live.mjs
import Stripe from "stripe";

const env = process.env;
const key = env.STRIPE_SECRET_KEY?.trim() ?? "";
const site = env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
const admin = env.ADMIN_TOKEN?.trim() ?? "";
const fee = Number(env.PLATFORM_FEE_PERCENT ?? "10");

const checks = [
  [key.startsWith("sk_live_") || key.startsWith("rk_live_"), "STRIPE_SECRET_KEY", key ? (key.includes("_test_") ? "テスト用キー" : "本番キー") : "未設定"],
  [(env.STRIPE_WEBHOOK_SECRET ?? "").startsWith("whsec_"), "STRIPE_WEBHOOK_SECRET", env.STRIPE_WEBHOOK_SECRET ? "設定済み" : "未設定"],
  [/^https:\/\/[^/]+/.test(site) && !site.includes("localhost"), "NEXT_PUBLIC_SITE_URL", site || "未設定"],
  [admin.length >= 32, "ADMIN_TOKEN", admin ? `${admin.length}文字` : "未設定"],
  [Boolean(env.DATABASE_URL?.trim()), "DATABASE_URL", env.DATABASE_URL ? "設定済み" : "未設定"],
  [Number.isFinite(fee) && fee > 0 && fee <= 20, "PLATFORM_FEE_PERCENT", `${fee}%`],
];

let failed = 0;
for (const [ok, name, detail] of checks) {
  if (!ok) failed++;
  console.log(`${ok ? "✓" : "✗"} ${name}: ${detail}`);
}

if (key) {
  const stripe = new Stripe(key);
  try {
    const acct = await stripe.accounts.retrieve();
    const rows = [
      [acct.charges_enabled, "決済が有効", String(acct.charges_enabled)],
      [acct.payouts_enabled, "入金が有効", String(acct.payouts_enabled)],
      [acct.country === "JP", "国", acct.country],
      [!acct.requirements?.currently_due?.length, "未提出の情報", (acct.requirements?.currently_due ?? []).join(", ") || "なし"],
    ];
    for (const [ok, name, detail] of rows) {
      if (!ok) failed++;
      console.log(`${ok ? "✓" : "✗"} Stripe ${name}: ${detail}`);
    }
    const hooks = await stripe.webhookEndpoints.list({ limit: 20 });
    const needed = ["checkout.session.completed", "invoice.paid"];
    const target = `${site.replace(/\/$/, "")}/api/webhooks/stripe`;
    const hook = hooks.data.find((h) => h.url === target && h.status === "enabled");
    const missing = hook ? needed.filter((e) => !hook.enabled_events.includes(e) && !hook.enabled_events.includes("*")) : needed;
    if (missing.length) failed++;
    console.log(`${missing.length ? "✗" : "✓"} Webhook ${target}: ${missing.length ? `未登録のイベント ${missing.join(", ")}` : "OK"}`);
  } catch (err) {
    failed++;
    console.log(`✗ Stripe API: ${err.message}`);
  }
}

console.log(failed ? `\n${failed}件の確認事項があります。` : "\n本番化の準備ができています。");
process.exit(failed ? 1 : 0);
