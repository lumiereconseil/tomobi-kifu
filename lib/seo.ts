import type { Metadata } from "next";
import { getDictionary, locales, type Locale } from "./i18n";
import { operator } from "./site";
import { siteUrl } from "./stripe";

/** Absolute URL of a page; `path` is "" for the locale home or starts with "/". */
export function pageUrl(locale: Locale, path = ""): string {
  // The static GitHub Pages build serves every page as a folder ending in "/".
  const slash = process.env.NEXT_PUBLIC_TRAILING_SLASH === "1" ? "/" : "";
  return `${siteUrl()}/${locale}${path}${slash}`;
}

/** Social share image for a locale, served from /public. */
export function ogImageUrl(locale: Locale): string {
  return `${siteUrl()}/og-${locale}.png`;
}

/**
 * Per-page metadata: canonical and hreflang URLs, Open Graph and X (Twitter) cards.
 * URLs are absolute so they keep the GitHub Pages base path.
 */
export function pageMetadata(
  locale: Locale,
  path: string,
  { title, description }: { title?: string; description?: string },
): Metadata {
  const t = getDictionary(locale);
  const desc = description ?? t.metaDescription;
  const fullTitle = title ? `${title} | ${t.siteName}` : t.metaTitle;
  const image = { url: ogImageUrl(locale), width: 1200, height: 630, alt: t.metaTitle };
  return {
    ...(title ? { title } : {}),
    description: desc,
    alternates: {
      canonical: pageUrl(locale, path),
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, pageUrl(l, path)])),
        "x-default": pageUrl("ja", path),
      },
    },
    openGraph: {
      type: "website",
      siteName: t.siteName,
      title: fullTitle,
      description: desc,
      url: pageUrl(locale, path),
      locale: locale === "ja" ? "ja_JP" : "en_US",
      alternateLocale: locale === "ja" ? ["en_US"] : ["ja_JP"],
      images: [image],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: desc, images: [image.url] },
  };
}

/** schema.org data for the home page: the site and the business behind it. */
export function homeJsonLd(locale: Locale) {
  const t = getDictionary(locale);
  const url = pageUrl(locale);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}#website`,
        url,
        name: t.siteName,
        alternateName: getDictionary(locale === "ja" ? "en" : "ja").siteName,
        description: t.metaDescription,
        inLanguage: locale,
        publisher: { "@id": `${siteUrl()}/#org` },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl()}/#org`,
        name: operator.tradeName,
        url: pageUrl("ja"),
        email: operator.email,
      },
    ],
  };
}
