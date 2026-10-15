import { describe, expect, it } from "vitest";
import { disasterFor, disasterRecipients, disasters, getDisaster } from "@/lib/disasters";
import { recipients } from "@/lib/recipients";

describe("disaster guides", () => {
  it("only reference listed recipients", () => {
    const slugs = new Set(recipients.map((r) => r.slug));
    for (const d of disasters) {
      for (const s of d.recipientSlugs) expect(slugs.has(s), `${d.slug} -> ${s}`).toBe(true);
      expect(disasterRecipients(d).length).toBe(d.recipientSlugs.length);
    }
  });

  it("have unique slugs and both languages", () => {
    expect(new Set(disasters.map((d) => d.slug)).size).toBe(disasters.length);
    for (const d of disasters) {
      for (const f of [d.name, d.area, d.summary, ...d.body]) {
        expect(f.ja.trim()).not.toBe("");
        expect(f.en.trim()).not.toBe("");
      }
    }
  });

  it("cover every domestic emergency appeal", () => {
    for (const r of recipients.filter((x) => x.emergency && x.region === "japan" && !x.sample)) {
      expect(disasterFor(r.slug), r.slug).toBeDefined();
    }
  });

  it("finds guides by slug", () => {
    expect(getDisaster("kumamoto-2026-earthquake")?.active).toBe(true);
    expect(getDisaster("nope")).toBeUndefined();
  });
});
