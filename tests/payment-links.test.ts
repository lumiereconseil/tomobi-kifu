import { afterEach, describe, expect, it } from "vitest";
import { paymentLinks, paymentLinksFor } from "@/lib/payment-links";

const link = (n: number) => ({ amountJpy: n, url: `https://buy.stripe.com/test_${n}` });

describe("paymentLinksFor", () => {
  afterEach(() => {
    delete paymentLinks["x"];
  });

  it("returns links that point at Stripe", () => {
    paymentLinks["x"] = { account: "acct_1", once: [link(1000)], monthly: [link(3000)], test: true };
    expect(paymentLinksFor("x")?.once[0].amountJpy).toBe(1000);
  });

  it("rejects links to anywhere else", () => {
    paymentLinks["x"] = { account: "acct_1", once: [{ amountJpy: 1000, url: "https://example.com/pay" }], monthly: [], test: true };
    expect(paymentLinksFor("x")).toBeUndefined();
  });

  it("returns nothing for recipients without links", () => {
    expect(paymentLinksFor("unknown")).toBeUndefined();
  });
});
