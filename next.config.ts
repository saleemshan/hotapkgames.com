import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import { withContentlayer } from "next-contentlayer2";

import { CRAWL_NOINDEX_VALUE } from "./lib/crawl";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  turbopack: {},
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    minimumCacheTTL: 86400,
    /** Explicit whitelist for `next/image` `quality`; avoids warnings + SSR/client URL drift. */
    qualities: [50, 70, 75],
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
    ],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
      ],
    },
    {
      source: "/api/:path*",
      headers: [{ key: "X-Robots-Tag", value: CRAWL_NOINDEX_VALUE }],
    },
    {
      source: "/admin/:path*",
      headers: [{ key: "X-Robots-Tag", value: CRAWL_NOINDEX_VALUE }],
    },
    {
      source: "/_next/:path*",
      headers: [{ key: "X-Robots-Tag", value: CRAWL_NOINDEX_VALUE }],
    },
    // SEO FIX: /search removed from robots.txt disallow (must be crawlable for SearchAction JSON-LD).
    // Excluded from SERP index via X-Robots-Tag header instead.
    {
      source: "/search",
      headers: [{ key: "X-Robots-Tag", value: CRAWL_NOINDEX_VALUE }],
    },
  ],
  async redirects() {
    return [];
  },
};

export default withContentlayer(withBundleAnalyzer(nextConfig));
