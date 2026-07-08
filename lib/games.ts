import { cache } from "react";
import type { Game as ContentGame } from "contentlayer/generated";

import {
  getAllGames as clGetAllGames,
  getGameBySlug as clGetGameBySlug,
} from "@/lib/content";
import { getPrimaryDownloadUrl } from "@/lib/download-links";
import { formatFileSizeDisplay } from "@/lib/format-file-size";

export type GameCategory = ContentGame["category"];

/** Shape expected by ported EarningGamesApk UI (GameCard, GameHero, etc.). */
export interface Game {
  slug: string;
  title: string;
  description: string | null;
  version: string | null;
  fileSize: string | null;
  downloadCount: number;
  rating: string | null;
  totalVotes: number;
  category: GameCategory;
  osRequirements: string | null;
  iconUrl: string | null;
  downloadUrl: string | null;
  googlePlayUrl: string | null;
  appStoreUrl: string | null;
  isNew: boolean;
  isUpdated: boolean;
  isFeatured: boolean;
  publishedAt: Date | null;
  updatedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  tags: string[];
}

function mapClCategoryToGameCategory(c: ContentGame["category"]): GameCategory {
  return c;
}

function parseDownloadCount(downloads: string, views: number): number {
  const d = downloads.trim();
  const km = d.match(/^([\d.]+)\s*([kKmM])?\+?$/i);
  if (km) {
    let n = parseFloat(km[1]);
    const u = km[2]?.toUpperCase();
    if (u === "K") n *= 1000;
    if (u === "M") n *= 1_000_000;
    return Math.round(n);
  }
  const digits = parseInt(d.replace(/\D/g, ""), 10);
  return Number.isFinite(digits) ? digits : views;
}

export function contentGameToEarningGame(g: ContentGame): Game {
  const publishedAt = new Date(g.publishedAt);
  const updatedAt = new Date(g.updatedAt);
  return {
    slug: g.slug,
    title: g.title,
    description: g.shortDescription || null,
    version: g.version || null,
    fileSize: g.size ? formatFileSizeDisplay(g.size) : null,
    downloadCount: parseDownloadCount(g.downloads, g.views),
    rating: String(g.rating ?? 0),
    totalVotes: g.votes,
    category: mapClCategoryToGameCategory(g.category),
    osRequirements: g.requirements || null,
    iconUrl: g.coverImage || null,
    downloadUrl: getPrimaryDownloadUrl(g.downloadLinks),
    googlePlayUrl: null,
    appStoreUrl: null,
    isNew: g.isNew,
    isUpdated: updatedAt.getTime() !== publishedAt.getTime(),
    isFeatured: g.featured,
    publishedAt,
    updatedAt,
    seoTitle: null,
    seoDescription: g.shortDescription || null,
    tags: g.tags ?? [],
  };
}

export const getAllGames = cache(async (): Promise<Game[]> => {
  return clGetAllGames().map(contentGameToEarningGame);
});

export const getGameBySlug = cache(
  async (slug: string): Promise<Game | undefined> => {
    const g = clGetGameBySlug(slug);
    return g ? contentGameToEarningGame(g) : undefined;
  },
);

export async function getFeaturedGames(limit = 6): Promise<Game[]> {
  const all = await getAllGames();
  return all
    .filter((x) => x.isFeatured)
    .sort((a, b) => Number(b.rating) - Number(a.rating))
    .slice(0, limit);
}

export async function getLatestGames(
  limit = 12,
  offset = 0,
  /** Omit games already shown in e.g. “Featured” to avoid duplicate cards above the fold. */
  excludeSlugs?: Set<string>,
): Promise<Game[]> {
  const all = await getAllGames();
  const filtered = excludeSlugs?.size
    ? all.filter((g) => !excludeSlugs.has(g.slug))
    : all;
  return filtered
    .sort(
      (a, b) =>
        (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0),
    )
    .slice(offset, offset + limit);
}

export async function getGamesByCategory(
  category: GameCategory,
  page = 1,
  limit = 12,
  sortBy: "newest" | "top-rated" | "most-viewed" = "newest",
): Promise<{ games: Game[]; total: number }> {
  const all = (await getAllGames()).filter((g) => g.category === category);

  const sorted = [...all].sort((a, b) => {
    if (sortBy === "top-rated") {
      return Number(b.rating) - Number(a.rating);
    }
    if (sortBy === "most-viewed") {
      return b.downloadCount - a.downloadCount;
    }
    return (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0);
  });

  const offset = (page - 1) * limit;
  return {
    games: sorted.slice(offset, offset + limit),
    total: sorted.length,
  };
}

export async function getRelatedGamesByTags(
  tags: string[],
  excludeSlug: string,
  limit = 6,
): Promise<Game[]> {
  if (!tags.length) return [];
  const tagSet = new Set(tags);
  const all = await getAllGames();
  return all
    .filter(
      (g) =>
        g.slug !== excludeSlug && (g.tags?.some((t) => tagSet.has(t)) ?? false),
    )
    .sort((a, b) => Number(b.rating) - Number(a.rating))
    .slice(0, limit);
}

export async function getTopRated(limit = 5): Promise<Game[]> {
  const all = await getAllGames();
  return [...all]
    .sort((a, b) => Number(b.rating) - Number(a.rating))
    .slice(0, limit);
}

export async function getMostViewed(limit = 5): Promise<Game[]> {
  const all = await getAllGames();
  return [...all]
    .sort((a, b) => b.downloadCount - a.downloadCount)
    .slice(0, limit);
}

export async function searchGames(query: string): Promise<Game[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const all = await getAllGames();
  return all
    .filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        (g.description?.toLowerCase().includes(q) ?? false),
    )
    .sort((a, b) => Number(b.rating) - Number(a.rating))
    .slice(0, 20);
}

export async function getTotalGamesCount(): Promise<number> {
  return (await getAllGames()).length;
}

export async function getTotalDownloads(): Promise<number> {
  const all = await getAllGames();
  return all.reduce((sum, g) => sum + (g.downloadCount || 0), 0);
}
