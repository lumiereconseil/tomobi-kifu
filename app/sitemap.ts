import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/lib/i18n";
import { recipients } from "@/lib/recipients";
import { siteUrl } from "@/lib/stripe";

const staticPaths = ["", "/how-it-works", "/apply", "/legal"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const paths = [...staticPaths, ...recipients.map((r) => `/recipients/${r.slug}`)];
  const languages = (path: string) =>
    Object.fromEntries(locales.map((l: Locale) => [l, `${base}/${l}${path}`]));

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      changeFrequency: path.startsWith("/recipients/") || path === "" ? "daily" : "monthly",
      priority: path === "" ? 1 : path.startsWith("/recipients/") ? 0.8 : 0.5,
      alternates: { languages: languages(path) },
    })),
  );
}
