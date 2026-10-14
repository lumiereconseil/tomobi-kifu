import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/checkout/route";
import { limits } from "@/lib/donation";
import { recipients } from "@/lib/recipients";

const direct = recipients.filter((r) => r.payment.mode === "direct");
const slug = direct[0].slug;
const unonboarded = direct.find((r) => !r.stripeAccountId);
const external = recipients.find((r) => r.payment.mode === "external")!;

function post(body: unknown, raw = false) {
  return POST(
    new Request("http://localhost/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: raw ? (body as string) : JSON.stringify(body),
    }),
  );
}

beforeEach(() => {
  vi.stubEnv("STRIPE_SECRET_KEY", "");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.test");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/checkout validation", () => {
  it("rejects recipients that take gifts on their own official page", async () => {
    const res = await post({ slug: external.slug, amount: 3000, currency: "jpy" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "external_recipient" });
  });

  it("accepts a donor-covered fee in demo mode", async () => {
    const res = await post({ slug, amount: 3000, currency: "jpy", coverFee: true, frequency: "monthly" });
    expect(res.status).toBe(200);
    expect((await res.json()).url).toContain("demo=1");
  });

  it("rejects invalid JSON with 400", async () => {
    const res = await post("{not json", true);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid_json" });
  });

  it("returns 404 for an unknown recipient", async () => {
    const res = await post({ slug: "nope", amount: 1000, currency: "jpy" });
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "unknown_recipient" });
  });

  it("returns 404 when slug is missing", async () => {
    const res = await post({ amount: 1000, currency: "jpy" });
    expect(res.status).toBe(404);
  });

  it.each(["eur", "JPY", "", undefined])("rejects currency %s with 400", async (currency) => {
    const res = await post({ slug, amount: 1000, currency });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid_currency" });
  });

  it.each([
    ["jpy", limits.jpy.min - 1],
    ["jpy", limits.jpy.max + 1],
    ["usd", limits.usd.min - 0.01],
    ["usd", limits.usd.max + 1],
    ["jpy", "abc"],
    ["jpy", null],
  ] as const)("rejects %s amount %s with 400", async (currency, amount) => {
    const res = await post({ slug, amount, currency });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid_amount" });
  });
});

describe("POST /api/checkout demo mode", () => {
  it("returns a demo success URL when STRIPE_SECRET_KEY is unset", async () => {
    const res = await post({ slug, amount: 3000, currency: "jpy", locale: "en" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ url: `/en/donate/success?demo=1&r=${slug}` });
  });

  it("accepts boundary amounts and falls back to ja for unknown locales", async () => {
    for (const amount of [limits.usd.min, limits.usd.max]) {
      const res = await post({ slug, amount, currency: "usd", locale: "fr" });
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ url: `/ja/donate/success?demo=1&r=${slug}` });
    }
  });
});

describe("POST /api/checkout live mode", () => {
  it("refuses live-key donations to a recipient without stripeAccountId (409, no Stripe call)", async () => {
    expect(unonboarded, "fixture needs a recipient without stripeAccountId").toBeDefined();
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_live_test");
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const res = await post({ slug: unonboarded!.slug, amount: 3000, currency: "jpy" });
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: "recipient_not_onboarded" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
