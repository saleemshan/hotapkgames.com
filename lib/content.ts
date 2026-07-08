import { allApps, allGames, allGuides } from "contentlayer/generated";
import type { App, Game, Guide } from "contentlayer/generated";

import { slugifyTag } from "@/lib/utils";

export function getAllApps(): App[] {
  return [...allApps].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getAllGames(): Game[] {
  return [...allGames].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getAllGuides(): Guide[] {
  return [...allGuides].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getAppBySlug(slug: string): App | undefined {
  return allApps.find((a) => a.slug === slug);
}

export function getGameBySlug(slug: string): Game | undefined {
  return allGames.find((g) => g.slug === slug);
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return allGuides.find((g) => g.slug === slug);
}

export function getTopRatedApps(limit = 6): App[] {
  return [...getAllApps()]
    .sort((a, b) => b.rating - a.rating || b.votes - a.votes)
    .slice(0, limit);
}

export function getTopRatedGames(limit = 6): Game[] {
  return [...getAllGames()]
    .sort((a, b) => b.rating - a.rating || b.votes - a.votes)
    .slice(0, limit);
}

/**
 * Homepage paginated grid: `featured` pins first, then **newest published** (page 1 surfaces fresh
 * listings — matches `/games?sort=latest` intent), then rating / votes as tie-breakers.
 */
export function getSortedHomepageGames(): Game[] {
  const featuredRank = (g: Game) => (g.featured ? 1 : 0);
  return [...getAllGames()].sort((a, b) => {
    if (featuredRank(b) !== featuredRank(a))
      return featuredRank(b) - featuredRank(a);
    const byNew =
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    if (byNew !== 0) return byNew;
    const byRating = b.rating - a.rating;
    if (byRating !== 0) return byRating;
    return b.votes - a.votes;
  });
}

export function getHomepageGamesPage(
  page: number,
  pageSize: number,
): {
  games: Game[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  startIndex: number;
} {
  const sorted = getSortedHomepageGames();
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  let safePage = Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
  if (safePage > totalPages) safePage = totalPages;
  const startIndex = (safePage - 1) * pageSize;
  const games = sorted.slice(startIndex, startIndex + pageSize);
  return {
    games,
    page: safePage,
    pageSize,
    total,
    totalPages,
    startIndex,
  };
}

export function getFeaturedGamesInCategory(
  category: Game["category"],
  limit = 6,
): Game[] {
  return getAllGames()
    .filter((g) => g.category === category)
    .slice(0, limit);
}

export function getRelatedGames(
  game: Game,
  limit = 4,
): Game[] {
  return getAllGames()
    .filter((g) => g.slug !== game.slug && g.category === game.category)
    .slice(0, limit);
}

export function getRelatedApps(app: App, limit = 4): App[] {
  return getAllApps()
    .filter((a) => a.slug !== app.slug && a.category === app.category)
    .slice(0, limit);
}

export function getMostViewedApps(limit = 5): App[] {
  return [...getAllApps()]
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

export function getMostViewedGames(limit = 5): Game[] {
  return [...getAllGames()]
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

export function getMostRatedGames(limit = 5): Game[] {
  return [...getAllGames()]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, limit);
}

export function getAppCategorySlugs(): string[] {
  const s = new Set<string>();
  for (const a of allApps) s.add(a.category);
  return [...s];
}

export function getGameCategorySlugs(): string[] {
  const s = new Set<string>();
  for (const g of allGames) s.add(g.category);
  return [...s];
}

export function getAllCategorySlugs(): string[] {
  return [...new Set([...getAppCategorySlugs(), ...getGameCategorySlugs()])];
}

export function getAppsByCategory(category: string): App[] {
  return getAllApps().filter((a) => a.category === category);
}

export function getGamesByCategory(category: string): Game[] {
  return getAllGames().filter((g) => g.category === category);
}

export function getGuidesByCategory(category: Guide["category"]): Guide[] {
  return getAllGuides().filter((g) => g.category === category);
}

export type SearchableItem = {
  id: string;
  kind: "app" | "game" | "guide";
  title: string;
  slug: string;
  href: string;
  shortDescription: string;
  tags: string[];
  category: string;
};

export function getAllSearchableItems(): SearchableItem[] {
  const apps: SearchableItem[] = getAllApps().map((a) => ({
    id: `app:${a.slug}`,
    kind: "app" as const,
    title: a.title,
    slug: a.slug,
    href: a.url,
    shortDescription: a.shortDescription,
    tags: a.tags,
    category: a.category,
  }));
  const games: SearchableItem[] = getAllGames().map((g) => ({
    id: `game:${g.slug}`,
    kind: "game" as const,
    title: g.title,
    slug: g.slug,
    href: g.url,
    shortDescription: g.shortDescription,
    tags: g.tags,
    category: g.category,
  }));
  const guides: SearchableItem[] = getAllGuides().map((g) => ({
    id: `guide:${g.slug}`,
    kind: "guide" as const,
    title: g.title,
    slug: g.slug,
    href: g.url,
    shortDescription: g.excerpt,
    tags: g.tags,
    category: g.category,
  }));
  return [...apps, ...games, ...guides];
}

export function getTagSlugMap(): Map<string, string> {
  const m = new Map<string, string>();
  for (const item of getAllSearchableItems()) {
    for (const t of item.tags) {
      const key = slugifyTag(t);
      if (!m.has(key)) m.set(key, t);
    }
  }
  return m;
}

export function getItemsByTagSlug(tagSlug: string): SearchableItem[] {
  const map = getTagSlugMap();
  const canonical = map.get(tagSlug);
  if (!canonical) return [];
  return getAllSearchableItems().filter((i) =>
    i.tags.some((t) => slugifyTag(t) === tagSlug),
  );
}

// SEO FIX: Same rule as app/(site)/tags/[tag]/page.tsx — thin tag pages are noindex and must not appear in sitemap.
export function isTagPageIndexable(tagSlug: string): boolean {
  return getItemsByTagSlug(tagSlug).length >= 3;
}

export function getRelatedGuides(guide: Guide, limit = 3): Guide[] {
  return getAllGuides()
    .filter(
      (g) =>
        g.slug !== guide.slug &&
        g.tags.some((t) => guide.tags.includes(t)),
    )
    .slice(0, limit);
}

const GUIDE_SLUGS_FOR_GAME_PAGES = [
  "jazzcash-easypaisa-withdrawals",
  "safe-apk-download-pakistan",
  "fake-casino-apps-pakistan",
  "best-earning-games-pakistan-2026",
  "color-prediction-apps-pakistan",
  "earning-games-without-investment-pakistan",
] as const;

/** Guides to surface on game detail pages: wallet/safety hubs + tag overlap. */
export function getGuidesForGame(game: Game, limit = 3): Guide[] {
  const gameTags = new Set(
    game.tags.map((t) => t.toLowerCase().trim()).filter(Boolean),
  );
  const scored = getAllGuides().map((g) => {
    let score = 0;
    if ((GUIDE_SLUGS_FOR_GAME_PAGES as readonly string[]).includes(g.slug))
      score += 2;
    for (const t of g.tags) {
      if (gameTags.has(t.toLowerCase().trim())) score += 4;
    }
    return { g, score };
  });
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (
      new Date(b.g.updatedAt).getTime() - new Date(a.g.updatedAt).getTime()
    );
  });
  const out: Guide[] = [];
  const seen = new Set<string>();
  for (const { g } of scored) {
    if (seen.has(g.slug)) continue;
    if (g.slug === game.slug) continue;
    seen.add(g.slug);
    out.push(g);
    if (out.length >= limit) break;
  }
  return out;
}
