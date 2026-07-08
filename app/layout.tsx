import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Providers } from "@/components/providers";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_LOGO } from "@/lib/site-media";
import {
  absoluteUrl,
  getDefaultOgImagePath,
  getGoogleSiteVerification,
  getOrgSameAs,
  getOrganizationSchemaId,
  getSiteUrl,
  getWebsiteSchemaId,
  siteConfig,
} from "@/lib/seo";

import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: ["/icon.png"],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  title: {
    default: siteConfig.defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "earning games pakistan",
    "casino apk download",
    "real money games pakistan",
    "pk earning apps",
  ],
  // SEO FIX: No default canonical — child routes must set self-referencing canonicals (root "/" leaked to paginated listings).
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    url: getSiteUrl(),
    // SEO FIX: Default share image when a route omits openGraph.images.
    images: [
      {
        url: getDefaultOgImagePath(),
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [getDefaultOgImagePath()],
  },
  verification: {
    google: getGoogleSiteVerification(),
  },
};

// SEO: One JSON-LD root with `@graph` — a bare `[org, website]` array is not valid JSON-LD.
// Includes SiteNavigationElement for Google Sitelinks eligibility.
function rootSiteGraphJsonLd() {
  const origin = getSiteUrl().replace(/\/$/, "");
  const orgId = getOrganizationSchemaId();
  const websiteId = getWebsiteSchemaId();

  // Primary navigation items — Google uses these to generate sitelinks.
  const siteNavItems = [
    { name: "Games", url: `${origin}/games` },
    { name: "Casino Games", url: `${origin}/category/casino-games` },
    { name: "Color Prediction", url: `${origin}/category/color-prediction` },
    { name: "Guides", url: `${origin}/guides` },
    { name: "About Us", url: `${origin}/about` },
    { name: "Contact", url: `${origin}/contact` },
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: siteConfig.name,
        url: origin,
        logo: absoluteUrl(SITE_LOGO.src),
        description: siteConfig.description,
        ...(getOrgSameAs().length ? { sameAs: getOrgSameAs() } : {}),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: siteConfig.name,
        url: origin,
        description: siteConfig.description,
        publisher: { "@id": orgId },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${origin}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      // SiteNavigationElement — signals primary site sections for Google Sitelinks.
      ...siteNavItems.map((item) => ({
        "@type": "SiteNavigationElement",
        name: item.name,
        url: item.url,
      })),
    ],
  };
}

// SEO FIX: Explicit mobile viewport (document for audits; matches Next defaults).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f1a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable} dark h-full`}
      suppressHydrationWarning
    >
      <head>
        {/* SEO FIX: Removed unused preconnect to gameistan.com.pk */}
      </head>
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
        <JsonLd data={rootSiteGraphJsonLd()} />
        <Providers>
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
