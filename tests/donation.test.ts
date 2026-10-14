import { describe, expect, it } from "vitest";
import { currencies, formatMoney, limits, presets, toStripeAmount } from "@/lib/donation";

describe("formatMoney", () => {
  it("formats JPY without decimals in ja and en", () => {
    expect(formatMoney(3000, "jpy", "ja")).toMatch(/^[￥¥]3,000$/);
    expect(formatMoney(3000, "jpy", "en")).toMatch(/^[￥¥]3,000$/);
  });

  it("rounds fractional JPY to whole yen", () => {
    expect(formatMoney(1234.6, "jpy", "en")).toMatch(/1,235$/);
  });

  it("formats integer USD without decimals", () => {
    expect(formatMoney(25, "usd", "en")).toBe("$25");
    expect(formatMoney(1000, "usd", "en")).toBe("$1,000");
  });

  it("formats decimal USD with up to two decimals", () => {
    expect(formatMoney(9.99, "usd", "en")).toBe("$9.99");
    expect(formatMoney(12.345, "usd", "en")).toBe("$12.35");
  });

  it("pads decimal USD to two decimals", () => {
    expect(formatMoney(12.5, "usd", "en")).toBe("$12.50");
  });

  it("formats USD for the ja locale", () => {
    const s = formatMoney(25, "usd", "ja");
    expect(s).toContain("25");
    expect(s).toMatch(/\$/);
    expect(s).not.toContain(".");
  });
});

describe("toStripeAmount", () => {
  it("keeps JPY as a zero-decimal currency", () => {
    expect(toStripeAmount(3000, "jpy")).toBe(3000);
    expect(toStripeAmount(1000.4, "jpy")).toBe(1000);
  });

  it("converts USD to cents", () => {
    expect(toStripeAmount(25, "usd")).toBe(2500);
    expect(toStripeAmount(12.34, "usd")).toBe(1234);
    expect(toStripeAmount(0.1 + 0.2, "usd")).toBe(30);
  });
});

describe("presets", () => {
  it.each(currencies)("%s presets are within limits and ascending", (c) => {
    const { min, max } = limits[c];
    expect(presets[c].length).toBeGreaterThan(0);
    for (const p of presets[c]) {
      expect(p).toBeGreaterThanOrEqual(min);
      expect(p).toBeLessThanOrEqual(max);
    }
    expect([...presets[c]].sort((a, b) => a - b)).toEqual(presets[c]);
  });

  it.each(currencies)("%s limits have min < max", (c) => {
    expect(limits[c].min).toBeLessThan(limits[c].max);
  });
});

describe("feeBreakdown", () => {
  it("takes the fee out of the gift when the donor does not cover it", async () => {
    const { feeBreakdown } = await import("@/lib/donation");
    expect(feeBreakdown(3000, 10, false)).toEqual({ total: 3000, fee: 300, toRecipient: 2700 });
  });

  it("grosses up the charge so the recipient gets the full amount when the donor covers it", async () => {
    const { feeBreakdown } = await import("@/lib/donation");
    const b = feeBreakdown(3000, 10, true);
    expect(b.toRecipient).toBe(3000);
    expect(b.total).toBe(3334);
    expect(b.fee).toBe(334);
    // The fee is at least the stated percentage of what the donor pays.
    expect(b.fee / b.total).toBeGreaterThanOrEqual(0.1);
  });

  it("charges no fee at 0%", async () => {
    const { feeBreakdown } = await import("@/lib/donation");
    expect(feeBreakdown(2500, 0, true)).toEqual({ total: 2500, fee: 0, toRecipient: 2500 });
  });
});

describe("platformFeePercent", () => {
  it("defaults to 10% and honours a valid override", async () => {
    const { platformFeePercent } = await import("@/lib/donation");
    const prev = process.env.PLATFORM_FEE_PERCENT;
    delete process.env.PLATFORM_FEE_PERCENT;
    expect(platformFeePercent()).toBe(10);
    process.env.PLATFORM_FEE_PERCENT = "7";
    expect(platformFeePercent()).toBe(7);
    process.env.PLATFORM_FEE_PERCENT = "abc";
    expect(platformFeePercent()).toBe(10);
    // A recipient's own rate (e.g. 5% for emergency appeals) wins.
    expect(platformFeePercent(5)).toBe(5);
    if (prev === undefined) delete process.env.PLATFORM_FEE_PERCENT;
    else process.env.PLATFORM_FEE_PERCENT = prev;
  });
});
