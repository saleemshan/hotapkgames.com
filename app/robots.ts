import type { MetadataRoute } from "next";

import { ROBOTS_TXT_DISALLOW } from "@/lib/crawl";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...ROBOTS_TXT_DISALLOW],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
