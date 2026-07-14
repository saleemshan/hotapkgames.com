import type { MetadataRoute } from "next";

import { ROBOTS_TXT_DISALLOW } from "@/lib/crawl";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      // Explicit Googlebot-Smartphone rule — critical for mobile-first indexing.
      // Without this, Google crawls mostly as Desktop (78%) and barely as Smartphone (3%).
      {
        userAgent: "Googlebot-Smartphone",
        allow: "/",
        disallow: [...ROBOTS_TXT_DISALLOW],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [...ROBOTS_TXT_DISALLOW],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: [...ROBOTS_TXT_DISALLOW],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
