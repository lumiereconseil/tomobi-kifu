import { describe, expect, it } from "vitest";
import { getDictionary, isLocale, locales } from "@/lib/i18n";

function keyPaths(obj: unknown, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object") return [prefix];
  return Object.entries(obj as Record<string, unknown>)
    .flatMap(([k, v]) => keyPaths(v, prefix ? `${prefix}.${k}` : k))
    .sort();
}

describe("dictionaries", () => {
  it("ja and en have identical key sets (recursive)", () => {
    expect(keyPaths(getDictionary("en"))).toEqual(keyPaths(getDictionary("ja")));
  });

  it("values have matching types and no empty strings", () => {
    const ja = getDictionary("ja") as Record<string, unknown>;
    const en = getDictionary("en") as Record<string, unknown>;
    for (const key of Object.keys(ja)) {
      expect(typeof en[key], key).toBe(typeof ja[key]);
      if (typeof ja[key] === "string") {
        expect((ja[key] as string).length, `ja.${key}`).toBeGreaterThan(0);
        expect((en[key] as string).length, `en.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it.each(locales)("%s minMax interpolates both bounds", (l) => {
    const s = getDictionary(l).minMax("MIN", "MAX");
    expect(s).toContain("MIN");
    expect(s).toContain("MAX");
  });
});

describe("isLocale", () => {
  it("accepts supported locales", () => {
    expect(isLocale("ja")).toBe(true);
    expect(isLocale("en")).toBe(true);
  });

  it("rejects anything else", () => {
    for (const v of ["", "fr", "JA", "en-US", "ja ", "__proto__"]) {
      expect(isLocale(v)).toBe(false);
    }
  });
});
