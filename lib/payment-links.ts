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

export const paymentLinks: Record<string, PaymentLinks> = {};

export function paymentLinksFor(slug: string): PaymentLinks | undefined {
  const l = paymentLinks[slug];
  const ok = (u: string) => /^https:\/\/(buy|checkout)\.stripe\.com\//.test(u);
  return l && [...l.once, ...l.monthly].every((x) => ok(x.url)) && l.once.length > 0 ? l : undefined;
}
