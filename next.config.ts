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
    return [
      {
        source: "/favicon.ico",
        destination: "/icon.png",
        permanent: false,
      },
      {
        source: "/apps",
        destination: "/games",
        permanent: true,
      },
      {
        source: "/apps/:path*",
        destination: "/games",
        permanent: true,
      },
      {
        source: "/category/earning-apps",
        destination: "/category/color-prediction",
        permanent: true,
      },
      {
        source: "/category/earning-apps/page/:page",
        destination: "/category/color-prediction",
        permanent: true,
      },
      {
        source: "/category/tools",
        destination: "/games",
        permanent: true,
      },
      {
        source: "/categories/:category",
        destination: "/category/:category",
        permanent: true,
      },
      {
        source: "/categories/:category/page/:page",
        destination: "/category/:category/page/:page",
        permanent: true,
      },
      {
        source: "/terms-conditions",
        destination: "/terms",
        permanent: true,
      },
      { source: "/done-55-game", destination: "/done999-game", permanent: true },
      { source: "/bet629-game", destination: "/9999win-game", permanent: true },
      { source: "/pk3-game", destination: "/9999win-game", permanent: true },
      { source: "/988win-game", destination: "/okpkr-game", permanent: true },
      { source: "/pkrfun-game", destination: "/p999-game", permanent: true },
      { source: "/xx555-game", destination: "/5555bet-game", permanent: true },
      { source: "/cd22-game", destination: "/p999-game", permanent: true },
      { source: "/done55-game", destination: "/done999-game", permanent: true },
      { source: "/p999-apk-pakistan-review", destination: "/p999-game", permanent: true },
      {
        source: "/guides/777-pkr-game-cd22-pakistan",
        destination: "/p999-game",
        permanent: true,
      },
      {
        source: "/games/:slug",
        destination: "/:slug",
        permanent: true,
      },
    ];
  },
};

export default withContentlayer(withBundleAnalyzer(nextConfig));
