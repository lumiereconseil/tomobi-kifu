/**
 * Stripe Payment Links for partner recipients, so the static site (GitHub Pages, no server)
 * can take donations. Each link is a destination charge: the gift goes straight to the
 * recipient's Stripe Connect account and only the fee stays with Lumière Conseil.
 * Generate entries with `node scripts/stripe-setup.mjs links <slug> <acct_...>`.
 */
export type PaymentLinks = {
  /** Connected account the links pay out to (acct_...). */
  account: string;
  /** One-time gifts at fixed amounts. */
  once: { amountJpy: number; url: string }[];
  /** Monthly gifts at fixed amounts. */
  monthly: { amountJpy: number; url: string }[];
  /** Whether these are test-mode links (shown with a notice, no real payment). */
  test: boolean;
};

export const paymentLinks: Record<string, PaymentLinks> = {
  // Test-mode buttons for the unlisted /test-donation page (no organisation, no real money).
  "test-donation": {
    account: "platform-test",
    once: [
      { amountJpy: 1000, url: "https://donate.stripe.com/test_14AbJ2aFP2Da5o338FbbG00" },
      { amountJpy: 3000, url: "https://donate.stripe.com/test_4gMaEYg09cdKcQvbFbbbG01" },
      { amountJpy: 5000, url: "https://donate.stripe.com/test_aFafZicNX91y17N6kRbbG02" },
      { amountJpy: 10000, url: "https://donate.stripe.com/test_7sY4gA6pz0v26s7aB7bbG03" },
    ],
    monthly: [
      { amountJpy: 1000, url: "https://buy.stripe.com/test_14A6oI9BL3He6s76kRbbG04" },
      { amountJpy: 3000, url: "https://buy.stripe.com/test_28E28seW56Tq17N4cJbbG05" },
      { amountJpy: 5000, url: "https://buy.stripe.com/test_7sY28s3dna5C8AfbFbbbG06" },
    ],
    test: true,
  },
};

export function paymentLinksFor(slug: string): PaymentLinks | undefined {
  const l = paymentLinks[slug];
  const ok = (u: string) => /^https:\/\/(buy|checkout|donate)\.stripe\.com\//.test(u);
  return l && [...l.once, ...l.monthly].every((x) => ok(x.url)) && l.once.length > 0 ? l : undefined;
}
