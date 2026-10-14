import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/stripe";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // API routes and post-checkout pages have no search value.
        disallow: ["/api/", ...locales.map((l) => `/${l}/donate/`)],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
