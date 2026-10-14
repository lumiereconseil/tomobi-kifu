// Builds a static copy of the site for GitHub Pages (no server: no payments, admin or API).
// Usage: node scripts/build-pages.mjs  → writes ./out
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

const root = process.cwd();
const tmp = join(root, ".pages-build");
const repo = (process.env.GITHUB_REPOSITORY ?? "lumiereconseil/tomobi-kifu").split("/");
const basePath = process.env.PAGES_BASE_PATH ?? `/${repo[1]}`;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${repo[0]}.github.io${basePath}`;

rmSync(tmp, { recursive: true, force: true });
const skip = new Set(["node_modules", ".next", "out", ".git", ".pages-build", "tests", "docs"]);
for (const name of readdirSync(root)) {
  if (!skip.has(name)) cpSync(join(root, name), join(tmp, name), { recursive: true });
}

symlinkSync(join(root, "node_modules"), join(tmp, "node_modules"), "dir");

// Server-only routes cannot be exported.
for (const p of ["app/api", "app/admin", "app/[locale]/donate", "app/[locale]/apply/connected"]) {
  rmSync(join(tmp, p), { recursive: true, force: true });
}

const edit = (file, fn) => {
  const f = join(tmp, file);
  const before = readFileSync(f, "utf8");
  const after = fn(before);
  // A rewrite that no longer matches the source would silently ship a broken build.
  if (after === before) throw new Error(`build-pages: no change applied to ${file}`);
  writeFileSync(f, after);
};

edit("next.config.ts", () =>
  `import type { NextConfig } from "next";\nconst nextConfig: NextConfig = { output: "export", trailingSlash: true, basePath: ${JSON.stringify(basePath)}, images: { unoptimized: true } };\nexport default nextConfig;\n`,
);
edit("app/[locale]/recipients/[slug]/page.tsx", (s) =>
  s
    .replace('export const dynamic = "force-dynamic";', 'export const dynamic = "force-static";')
    .replace(
      'import { getRecipient, isDirect, type Recipient } from "@/lib/recipients";',
      'import { getRecipient, isDirect, recipients as allRecipients, type Recipient } from "@/lib/recipients";\nimport { locales } from "@/lib/i18n";\nexport function generateStaticParams() {\n  return locales.flatMap((locale) => allRecipients.map((r) => ({ locale, slug: r.slug })));\n}',
    ),
);
// Query-string filters need a server; the static home lists everything, split by region.
edit("app/[locale]/page.tsx", (s) =>
  'export const dynamic = "force-static";\n' +
  s.replace(/\s*<div className="filters">[\s\S]*?\n {8}<\/div>\n/, "\n"),
);
for (const f of ["app/robots.ts", "app/sitemap.ts"]) {
  edit(f, (s) => 'export const dynamic = "force-static";\n' + s);
}

execSync("npx next build", {
  cwd: tmp,
  stdio: "inherit",
  env: { ...process.env, NEXT_PUBLIC_SITE_URL: siteUrl, NEXT_PUBLIC_TRAILING_SLASH: "1", NODE_ENV: "production" },
});

const out = join(root, "out");
rmSync(out, { recursive: true, force: true });
cpSync(join(tmp, "out"), out, { recursive: true });
rmSync(tmp, { recursive: true, force: true });

// Pages has no redirects: send the root to the Japanese home.
writeFileSync(
  join(out, "index.html"),
  `<!doctype html><meta charset="utf-8"><title>ともに寄付</title><meta http-equiv="refresh" content="0; url=${basePath}/ja/"><link rel="canonical" href="${siteUrl}/ja/"><a href="${basePath}/ja/">ともに寄付へ</a>\n`,
);
writeFileSync(join(out, ".nojekyll"), "");
if (!existsSync(join(out, "ja", "index.html"))) throw new Error("ja/index.html missing");
console.log(`Static site written to out/ (base ${basePath})`);
