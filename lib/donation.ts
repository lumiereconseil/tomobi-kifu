export const currencies = ["jpy", "usd"] as const;
export type Currency = (typeof currencies)[number];

export const presets: Record<Currency, number[]> = {
  jpy: [1000, 3000, 5000, 10000],
  usd: [10, 25, 50, 100],
};

export const limits: Record<Currency, { min: number; max: number }> = {
  jpy: { min: 500, max: 1_000_000 },
  usd: { min: 5, max: 10_000 },
};

/**
 * Default administrative fee kept by Lumière Conseil from each direct donation (via the
 * Stripe Connect application fee); card processing is paid out of it. Override with
 * PLATFORM_FEE_PERCENT. Individual recipients can set their own rate (e.g. 5% for disaster
 * emergency appeals, see lib/recipients.ts).
 */
export function platformFeePercent(override?: number): number {
  if (override != null && Number.isFinite(override) && override >= 0 && override < 100) return override;
  const v = Number(process.env.PLATFORM_FEE_PERCENT ?? 10);
  return Number.isFinite(v) && v >= 0 && v < 100 ? v : 10;
}

/**
 * Splits a gift into what the donor pays and the platform fee, in Stripe minor units.
 * When the donor covers the fee, the charge is grossed up so the recipient receives the
 * full amount the donor chose; otherwise the fee is taken out of that amount.
 */
export function feeBreakdown(amountMinor: number, feePercent: number, donorCoversFee: boolean) {
  const f = feePercent / 100;
  if (donorCoversFee && f > 0) {
    const total = Math.ceil(amountMinor / (1 - f));
    return { total, fee: total - amountMinor, toRecipient: amountMinor };
  }
  const fee = Math.floor(amountMinor * f);
  return { total: amountMinor, fee, toRecipient: amountMinor - fee };
}

/** Same as feeBreakdown, in display units (yen or dollars). */
export function feeBreakdownDisplay(amount: number, currency: Currency, feePercent: number, cover: boolean) {
  const b = feeBreakdown(toStripeAmount(amount, currency), feePercent, cover);
  const d = (n: number) => (currency === "jpy" ? n : n / 100);
  return { total: d(b.total), fee: d(b.fee), toRecipient: d(b.toRecipient) };
}

export function formatMoney(amount: number, currency: Currency, locale: string): string {
  return new Intl.NumberFormat(locale === "ja" ? "ja-JP" : "en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: currency === "jpy" || Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: currency === "jpy" || Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

/** Converts a display amount to Stripe's smallest currency unit (JPY is zero-decimal). */
export function toStripeAmount(amount: number, currency: Currency): number {
  return currency === "jpy" ? Math.round(amount) : Math.round(amount * 100);
}
