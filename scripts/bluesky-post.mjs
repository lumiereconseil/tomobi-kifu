// Posts one ともに寄付 message a day to Bluesky (run by .github/workflows/bluesky.yml).
// Usage: BLUESKY_HANDLE=... BLUESKY_APP_PASSWORD=... node scripts/bluesky-post.mjs [--dry-run]
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SERVICE = "https://bsky.social";
const MAX_GRAPHEMES = 300;

/** Today's date in Japan as "YYYY-MM-DD". */
export function jstDate(now = new Date()) {
  return new Date(now.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

/** Posts whose optional from/until window (inclusive, JST dates) covers `day`. */
export function activePosts(posts, day) {
  return posts.filter((p) => (!p.from || p.from <= day) && (!p.until || day <= p.until));
}

/** The post for `day`: rotates through the active posts so each day differs from the last. */
export function pickPost(posts, day) {
  const active = activePosts(posts, day);
  if (active.length === 0) return undefined;
  const dayNumber = Math.floor(Date.parse(`${day}T00:00:00Z`) / 86_400_000);
  return active[dayNumber % active.length];
}

export function graphemeCount(text) {
  return [...new Intl.Segmenter("ja", { granularity: "grapheme" }).segment(text)].length;
}

/** Rich-text facets so links and hashtags are clickable. Offsets are UTF-8 byte positions. */
export function facets(text) {
  const enc = new TextEncoder();
  const byteAt = (i) => enc.encode(text.slice(0, i)).length;
  const out = [];
  for (const m of text.matchAll(/https?:\/\/[^\s]+/g)) {
    out.push({
      index: { byteStart: byteAt(m.index), byteEnd: byteAt(m.index + m[0].length) },
      features: [{ $type: "app.bsky.richtext.facet#link", uri: m[0] }],
    });
  }
  for (const m of text.matchAll(/(^|\s)(#([^\s#]+))/g)) {
    const start = m.index + m[1].length;
    out.push({
      index: { byteStart: byteAt(start), byteEnd: byteAt(start + m[2].length) },
      features: [{ $type: "app.bsky.richtext.facet#tag", tag: m[3] }],
    });
  }
  return out;
}

async function xrpc(method, body, token) {
  const res = await fetch(`${SERVICE}/xrpc/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${method} failed (${res.status}): ${data.message ?? data.error ?? "unknown error"}`);
  return data;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const posts = JSON.parse(readFileSync(new URL("../content/bluesky-posts.json", import.meta.url), "utf8"));
  const day = jstDate();
  const post = pickPost(posts, day);
  if (!post) {
    console.log(`No active post for ${day}.`);
    return;
  }
  console.log(`Post for ${day}:\n${post.text}`);
  if (dryRun) return;

  const identifier = process.env.BLUESKY_HANDLE?.trim();
  const password = process.env.BLUESKY_APP_PASSWORD?.trim();
  if (!identifier || !password) {
    // Not an error: the secrets are added by the account owner after this workflow lands.
    console.log("::warning::BLUESKY_HANDLE or BLUESKY_APP_PASSWORD is not set; nothing was posted.");
    return;
  }
  const session = await xrpc("com.atproto.server.createSession", { identifier, password });
  const record = {
    $type: "app.bsky.feed.post",
    text: post.text,
    facets: facets(post.text),
    langs: [post.lang ?? "ja"],
    createdAt: new Date().toISOString(),
  };
  const created = await xrpc("com.atproto.repo.createRecord", { repo: session.did, collection: "app.bsky.feed.post", record }, session.accessJwt);
  console.log(`Posted: ${created.uri}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

export { MAX_GRAPHEMES };
