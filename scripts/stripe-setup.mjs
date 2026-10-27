// Sets up donations on the static site (GitHub Pages) with Stripe, no server needed.
//   node scripts/stripe-setup.mjs onboard <email> "<org name>"
//     → creates a Stripe Connect Express account for a vetted organisation (a Japanese legal
//       entity) and prints its acct_... id and a one-time onboarding link to send them.
//   node scripts/stripe-setup.mjs links <slug> <acct_...> [feePercent]
//     → creates Payment Links that pay straight to that account (destination charge, the
//       fee stays with the platform) and prints the entry for lib/payment-links.ts.
// Needs STRIPE_SECRET_KEY. Test keys (sk_test_) make test links; never run with a live key
// without Masa's go-ahead.
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY?.trim();
if (!key) {
  console.error("STRIPE_SECRET_KEY が未設定です。");
  process.exit(1);
}
const stripe = new Stripe(key);
const test = !/^(sk|rk)_live_/.test(key);
const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumiereconseil.github.io/tomobi-kifu").replace(/\/$/, "");
const [cmd, ...args] = process.argv.slice(2);

// New Connect platforms must create accounts with Accounts v2 (Stripe refuses v1 creates).
async function createOrgAccount(email, orgName, { merchant = true } = {}) {
  const account = await stripe.v2.core.accounts.create({
    contact_email: email,
    display_name: orgName.slice(0, 100),
    identity: { country: "JP", entity_type: "non_profit" },
    dashboard: "express",
    defaults: { responsibilities: { fees_collector: "application", losses_collector: "application" } },
    configuration: {
      ...(merchant ? { merchant: { capabilities: { card_payments: { requested: true } } } } : {}),
      recipient: { capabilities: { stripe_balance: { stripe_transfers: { requested: true } } } },
    },
    metadata: { org_name: orgName.slice(0, 450) },
  });
  const link = await stripe.v2.core.accountLinks.create({
    account: account.id,
    use_case: {
      type: "account_onboarding",
      account_onboarding: { refresh_url: `${site}/ja/apply/`, return_url: `${site}/ja/apply/` },
    },
  });
  return { account: account.id, onboardingUrl: link.url, test };
}

if (cmd === "onboard") {
  const [email, orgName] = args;
  if (!email || !orgName) throw new Error('usage: onboard <email> "<org name>"');
  console.log(JSON.stringify(await createOrgAccount(email, orgName), null, 2));
} else if (cmd === "links") {
  const [slug, account, feeArg] = args;
  if (!slug || !account?.startsWith("acct_")) throw new Error("usage: links <slug> <acct_...> [feePercent]");
  const fee = Number(feeArg ?? process.env.PLATFORM_FEE_PERCENT ?? 10);
  const acct = await stripe.accounts.retrieve(account);
  if (!acct.charges_enabled) throw new Error(`${account} はまだ決済を受け付けられません（登録が未完了）。`);

  const name = acct.business_profile?.name || acct.metadata?.org_name || slug;
  const product = await stripe.products.create({ name: `寄付: ${name}`, metadata: { recipient: slug } });
  const common = {
    on_behalf_of: account,
    transfer_data: { destination: account },
    metadata: { recipient: slug },
    after_completion: { type: "redirect", redirect: { url: `${site}/ja/recipients/${slug}/?thanks=1` } },
  };

  // Payment Links take a percent fee only on subscriptions, so one-time gifts use fixed
  // amounts with a fixed fee per link.
  const once = [];
  for (const amountJpy of [1000, 3000, 5000, 10000]) {
    const price = await stripe.prices.create({ product: product.id, currency: "jpy", unit_amount: amountJpy });
    const link = await stripe.paymentLinks.create({
      ...common,
      line_items: [{ price: price.id, quantity: 1 }],
      application_fee_amount: Math.floor((amountJpy * fee) / 100),
      submit_type: "donate",
    });
    once.push({ amountJpy, url: link.url });
  }

  const monthly = [];
  for (const amountJpy of [1000, 3000, 5000]) {
    const price = await stripe.prices.create({ product: product.id, currency: "jpy", unit_amount: amountJpy, recurring: { interval: "month" } });
    const link = await stripe.paymentLinks.create({
      ...common,
      line_items: [{ price: price.id, quantity: 1 }],
      subscription_data: { metadata: { recipient: slug } },
      application_fee_percent: fee,
    });
    monthly.push({ amountJpy, url: link.url });
  }
  const entry = { account, once, monthly, test };
  console.log(`  ${JSON.stringify(slug)}: ${JSON.stringify(entry, null, 2).replace(/\n/g, "\n  ")},`);
} else if (cmd === "test-org") {
  // Test mode only: a dummy organisation to try the whole flow end to end. Its onboarding
  // link is for test data, so printing it in a public log is harmless. Stripe's test mode
  // (outside a sandbox) only onboards transfer-only accounts, so this one has no merchant
  // config and its test links skip on_behalf_of.
  if (!test) throw new Error("test-org はテストキーでのみ使えます。");
  console.log(JSON.stringify(await createOrgAccount("test-org@example.com", "テスト団体（動作確認用）", { merchant: false }), null, 2));
} else if (cmd === "status") {
  // Shows whether the key works and which connected accounts can already take donations.
  const me = await stripe.accounts.retrieve();
  console.log(`${test ? "テストモード" : "本番モード"} / ${me.settings?.dashboard?.display_name || me.id} / 決済 ${me.charges_enabled ? "有効" : "未有効"}`);
  const list = await stripe.accounts.list({ limit: 100 });
  for (const a of list.data) {
    const name = a.business_profile?.name || a.metadata?.org_name || "(名称未登録)";
    console.log(`- ${a.id} ${name}: ${a.charges_enabled ? "寄付を受け付け可" : "登録未完了"}`);
  }
  if (!list.data.length) console.log("連結アカウント（団体）はまだありません。");
} else {
  console.error("usage: onboard <email> \"<org name>\" | links <slug> <acct_...> [feePercent] | status");
  process.exit(1);
}
