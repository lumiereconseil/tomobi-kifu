import { getStore, type StoredApplication } from "./db";
import type { Locale } from "./i18n";
import { getStripe, siteUrl } from "./stripe";

export type OnboardingResult = { url: string; accountId?: string; demo?: boolean };

/**
 * Creates (or reuses) a Stripe Connect Express account for a vetted application and returns
 * an onboarding link to send to the organisation. Only Japanese legal entities are onboarded:
 * a Japanese Stripe platform cannot pay out abroad, and local governments are listed as links
 * to their official donation pages instead (see lib/recipients.ts).
 */
export async function createOnboardingLink(app: StoredApplication, locale: Locale): Promise<OnboardingResult> {
  const base = `${siteUrl()}/${locale}/apply`;
  const stripe = getStripe();
  if (!stripe) {
    // Demo mode: no Stripe account is created; point straight at the return page.
    return { url: `${base}/connected?demo=1&application=${app.id}`, demo: true };
  }

  let accountId = app.stripeAccountId;
  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "JP",
      email: app.email,
      business_type: "non_profit",
      capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
      metadata: { application_id: String(app.id), org_name: app.orgName.slice(0, 450) },
    });
    accountId = account.id;
    await getStore().setApplicationStripeAccount(app.id, accountId);
  }

  const link = await stripe.accountLinks.create({
    account: accountId,
    type: "account_onboarding",
    refresh_url: `${base}/connected?refresh=1&application=${app.id}`,
    return_url: `${base}/connected?application=${app.id}`,
  });
  return { url: link.url, accountId };
}
