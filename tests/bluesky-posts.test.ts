import { describe, expect, it } from "vitest";
import posts from "../content/bluesky-posts.json";
import { activePosts, facets, graphemeCount, MAX_GRAPHEMES, pickPost } from "../scripts/bluesky-post.mjs";

describe("Bluesky daily posts", () => {
  it("fit Bluesky's 300-character limit", () => {
    for (const p of posts) expect(graphemeCount(p.text), p.text).toBeLessThanOrEqual(MAX_GRAPHEMES);
  });

  it("link only to the published site", () => {
    for (const p of posts) {
      const urls = p.text.match(/https?:\/\/\S+/g) ?? [];
      expect(urls.length, p.text).toBeGreaterThan(0);
      for (const u of urls) expect(u.startsWith("https://lumiereconseil.github.io/tomobi-kifu/")).toBe(true);
    }
  });

  it("always has something to post, and drops posts past their deadline", () => {
    expect(pickPost(posts, "2026-11-12")).toBeDefined();
    expect(pickPost(posts, "2027-06-01")).toBeDefined();
    const after = activePosts(posts, "2026-12-01").map((p) => p.text);
    expect(after.some((t) => t.includes("11月30日まで"))).toBe(false);
  });

  it("posts something different on consecutive days", () => {
    expect(pickPost(posts, "2026-11-12")).not.toBe(pickPost(posts, "2026-11-13"));
  });

  it("marks links and hashtags at the right byte offsets", () => {
    const text = "千葉へ\nhttps://example.org/a/\n#千葉 #義援金";
    const bytes = new TextEncoder().encode(text);
    const slice = (f: { index: { byteStart: number; byteEnd: number } }) => new TextDecoder().decode(bytes.slice(f.index.byteStart, f.index.byteEnd));
    expect(facets(text).map(slice)).toEqual(["https://example.org/a/", "#千葉", "#義援金"]);
  });
});
