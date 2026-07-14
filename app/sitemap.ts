import type { MetadataRoute } from "next";

import {
  getAllGames,
  getAllGuides,
  getAllCategorySlugs,
  getTagSlugMap,
  isTagPageIndexable,
} from "@/lib/content";
import { getGamesByCategory } from "@/lib/games";
import { getSiteUrl } from "@/lib/seo";

/** Must match `ITEMS_PER_PAGE` in `app/(site)/category/[category]/page.tsx`. */
const EARNING_CATEGORY_PAGE_SIZE = 12;

/** Slugs for `/category/[category]` (EarningGames-style hubs). Keep in sync with that route’s VALID_CATEGORIES. */
const EARNING_CATEGORY_SLUGS = [
  "casino-games",
  "color-prediction",
  "card-games",
  "sports-betting",
] as const;

function latestModified(...dates: (string | Date | null | undefined)[]): Date {
  const times = dates
    .filter((d): d is string | Date => d != null)
    .map((d) => new Date(d).getTime())
    .filter((t) => !Number.isNaN(t));
  return times.length ? new Date(Math.max(...times)) : new Date();
}

/** Stable last-modified date for legal / static pages that rarely change. Update when content is edited. */
const LEGAL_LAST_MODIFIED = new Date("2026-01-15");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();

  const games = getAllGames();
  const guides = getAllGuides();

  const homeLastModified = latestModified(
    ...games.map((g) => g.updatedAt),
    ...guides.map((g) => g.updatedAt),
  );
  const gamesHubLastModified = latestModified(...games.map((g) => g.updatedAt));
  const guidesHubLastModified = latestModified(...guides.map((g) => g.updatedAt));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: homeLastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/games`,
      lastModified: gamesHubLastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/guides`,
      lastModified: guidesHubLastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    { url: `${base}/about`,          lastModified: LEGAL_LAST_MODIFIED, changeFrequency: "yearly", priority: 0.55 },
    { url: `${base}/contact`,         lastModified: LEGAL_LAST_MODIFIED, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/disclaimer`,      lastModified: LEGAL_LAST_MODIFIED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy-policy`,  lastModified: LEGAL_LAST_MODIFIED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`,           lastModified: LEGAL_LAST_MODIFIED, changeFrequency: "yearly", priority: 0.3 },
  ];

  const earningCategoryRoutes: MetadataRoute.Sitemap = [];
  for (const slug of EARNING_CATEGORY_SLUGS) {
    const { games: categoryGames, total } = await getGamesByCategory(
      slug,
      1,
      EARNING_CATEGORY_PAGE_SIZE,
    );
    const categoryLastModified = latestModified(
      ...categoryGames.map((g) => g.updatedAt),
    );
    const totalPages = Math.max(1, Math.ceil(total / EARNING_CATEGORY_PAGE_SIZE));
    earningCategoryRoutes.push({
      url: `${base}/category/${slug}`,
      lastModified: categoryLastModified,
      changeFrequency: "weekly",
      priority: 0.72,
    });
    // Page 2 is indexable (`generateCategoryMetadata` noindex only for page > 2).
    if (totalPages >= 2) {
      earningCategoryRoutes.push({
        url: `${base}/category/${slug}/page/2`,
        lastModified: categoryLastModified,
        changeFrequency: "weekly",
        priority: 0.58,
      });
    }
  }

  const appRoutes: MetadataRoute.Sitemap = [];

  const gameRoutes = games.map((g) => ({
    url: `${base}${g.url}`,
    lastModified: new Date(g.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const guideRoutes = guides.map((g) => ({
    url: `${base}${g.url}`,
    lastModified: new Date(g.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // SEO FIX: Use canonical /category/${c} URLs — NOT /categories/${c} which 301-redirects.
  // Redirect source URLs in a sitemap waste crawl budget and send mixed signals to Google.
  // These supplement earningCategoryRoutes (which covers the 4 primary earning categories).
  const categories = getAllCategorySlugs()
    .filter((c) => !EARNING_CATEGORY_SLUGS.includes(c as (typeof EARNING_CATEGORY_SLUGS)[number]))
    .map((c) => ({
      url: `${base}/category/${c}`,
      lastModified: gamesHubLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.65,
    }));

  // SEO FIX: Omit thin tag URLs (noindex in generateMetadata) to avoid sitemap vs robots conflicts.
  const tags = [...getTagSlugMap().keys()]
    .filter((t) => isTagPageIndexable(t))
    .map((t) => ({
      url: `${base}/tags/${t}`,
      changeFrequency: "weekly" as const,
      priority: 0.55,
    }));

  return [
    ...staticRoutes,
    ...earningCategoryRoutes,
    ...appRoutes,
    ...gameRoutes,
    ...guideRoutes,
    ...categories,
    ...tags,
  ];
}
