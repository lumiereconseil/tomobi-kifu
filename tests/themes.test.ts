import { describe, expect, it } from "vitest";
import { recipients } from "@/lib/recipients";
import { getTheme, themeFor, themeRecipients, themes } from "@/lib/themes";

describe("cause pages", () => {
  it("only reference listed welfare recipients", () => {
    const bySlug = new Map(recipients.map((r) => [r.slug, r]));
    for (const t of themes) {
      for (const s of t.recipientSlugs) expect(bySlug.get(s)?.category, `${t.slug} -> ${s}`).toBe("welfare");
      expect(themeRecipients(t).length).toBe(t.recipientSlugs.length);
    }
  });

  it("put each recipient in at most one cause", () => {
    const all = themes.flatMap((t) => t.recipientSlugs);
    expect(new Set(all).size).toBe(all.length);
  });

  it("cover every listed welfare recipient in Japan", () => {
    for (const r of recipients.filter((x) => x.category === "welfare" && x.region === "japan" && !x.sample && x.slug !== "bussien")) {
      expect(themeFor(r.slug), r.slug).toBeDefined();
    }
  });

  it("finds causes by slug", () => {
    expect(getTheme("food")?.emoji).toBeTruthy();
    expect(getTheme("nope")).toBeUndefined();
  });
});
