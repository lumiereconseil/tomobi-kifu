import { describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n";
import { getRecipient, recipients } from "@/lib/recipients";

describe("recipients", () => {
  it("is non-empty", () => {
    expect(recipients.length).toBeGreaterThan(0);
  });

  it("has unique, URL-safe slugs", () => {
    const slugs = recipients.map((r) => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it.each(recipients.map((r) => [r.slug, r] as const))("%s has ja+en text", (_slug, r) => {
    for (const field of ["country", "name", "summary", "description"] as const) {
      for (const l of locales) {
        expect(r[field][l]?.trim().length, `${field}.${l}`).toBeGreaterThan(0);
      }
    }
  });

  it.each(recipients.map((r) => [r.slug, r] as const))("%s has sane numbers", (_slug, r) => {
    // Only recipients that take gifts on this site track a goal.
    if (r.payment.mode === "direct") expect(r.goalJpy).toBeGreaterThan(0);
    expect(r.raisedJpy).toBeGreaterThanOrEqual(0);
    // Sanity bound: raised should not exceed 10x the goal.
    if (r.payment.mode === "direct") expect(r.raisedJpy).toBeLessThanOrEqual(r.goalJpy * 10);
    expect(Number.isInteger(r.supporters)).toBe(true);
    expect(r.supporters).toBeGreaterThanOrEqual(0);
    if (r.stripeAccountId !== undefined) expect(r.stripeAccountId).toMatch(/^acct_/);
  });
});

describe("getRecipient", () => {
  it("finds every recipient by slug", () => {
    for (const r of recipients) expect(getRecipient(r.slug)).toBe(r);
  });

  it("returns undefined for unknown slugs", () => {
    expect(getRecipient("does-not-exist")).toBeUndefined();
    expect(getRecipient("")).toBeUndefined();
  });
});

describe("listing priority", () => {
  it("puts every Japanese recipient before any overseas one, disaster and welfare first", async () => {
    const { byPriority, priorityRank } = await import("@/lib/recipients");
    const sorted = [...recipients].sort(byPriority);
    const firstWorld = sorted.findIndex((r) => r.region === "world");
    expect(sorted.slice(firstWorld).every((r) => r.region === "world")).toBe(true);
    const domestic = sorted.slice(0, firstWorld);
    const firstMunicipalOnly = domestic.findIndex((r) => priorityRank(r) === 3);
    if (firstMunicipalOnly >= 0) {
      expect(domestic.slice(0, firstMunicipalOnly).every((r) => ["disaster", "welfare", "municipality"].includes(r.category))).toBe(true);
    }
  });
});

describe("public listing", () => {
  it("lists only real organisations when demo samples are off", async () => {
    const { vi } = await import("vitest");
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_DEMO_SAMPLES", "");
    const mod = await import("@/lib/recipients");
    expect(mod.recipients.length).toBeGreaterThan(0);
    expect(mod.recipients.every((r) => !r.sample)).toBe(true);
    // Nothing is paid on the public site until a partner is onboarded.
    expect(mod.recipients.every((r) => r.payment.mode === "external" && r.payment.url.startsWith("https://"))).toBe(true);
    vi.unstubAllEnvs();
    vi.resetModules();
  });
});
