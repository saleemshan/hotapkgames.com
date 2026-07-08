import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import type { UserReview } from "@/components/game/UserReviews";
import { getAllGames, getGameBySlug } from "@/lib/content";
import { approvedFileSchema } from "@/lib/review-file-types";
import { approvedReviewPath, USER_REVIEWS_ROOT } from "@/lib/review-fs-paths";
import { siteConfig } from "@/lib/seo";

export { averageReviewRating } from "@/lib/review-average";

function mapMdxReviews(slug: string): UserReview[] {
  const g = getGameBySlug(slug);
  if (!g?.playerReviews?.length) return [];
  const date = g.updatedAt.slice(0, 10);
  return g.playerReviews.map((r, i) => ({
    name: r.name,
    city: r.place ?? "Pakistan",
    rating: r.rating,
    date,
    comment: r.text,
    helpful: Math.max(1, 24 - i * 3),
  }));
}

/** Approved JSON at `data/user-reviews/approved/{slug}.json` (git-tracked). */
export function loadApprovedFileReviews(slug: string): UserReview[] {
  const filePath = approvedReviewPath(slug);
  if (!existsSync(filePath)) return [];
  try {
    const raw = readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    const rows = approvedFileSchema.parse(parsed);
    return rows.map((r, i) => ({
      name: r.name,
      city: r.city ?? "Pakistan",
      rating: r.rating,
      date: r.date,
      comment: r.comment,
      helpful: r.helpful ?? Math.max(1, 18 - i * 2),
    }));
  } catch {
    return [];
  }
}

function getApprovedSnippetsForHome(max: number): UserReview[] {
  const dir = path.join(USER_REVIEWS_ROOT, "approved");
  if (!existsSync(dir) || max <= 0) return [];
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
  const out: UserReview[] = [];
  for (const f of files) {
    if (out.length >= max) break;
    const slug = f.replace(/\.json$/i, "");
    const rows = loadApprovedFileReviews(slug);
    if (rows[0]) out.push(rows[0]);
  }
  return out;
}

function getFallbackReviewsForGame(gameTitle: string, date: string): UserReview[] {
  return [
    {
      name: "Reader",
      city: "Pakistan",
      rating: 4,
      date,
      comment: `Illustrative note about ${gameTitle}: use the version and file size on this listing to spot outdated mirrors—always confirm bonuses and withdrawals on the official app.`,
      helpful: 8,
    },
    {
      name: "Player",
      city: "Pakistan",
      rating: 4,
      date,
      comment: `${siteConfig.name} lays out JazzCash / EasyPaisa context and pros/cons without spammy popups—still verify the download link yourself before depositing.`,
      helpful: 6,
    },
  ];
}

/**
 * MDX `playerReviews` → approved JSON → illustrative fallback so every game page
 * matches home-style UserReviews (static HTML for crawlers).
 */
export function getReviewsForGame(slug: string): UserReview[] {
  const g = getGameBySlug(slug);
  if (!g) return [];

  const mdx = mapMdxReviews(slug);
  const file = loadApprovedFileReviews(slug);
  const merged = [...mdx, ...file];
  if (merged.length > 0) return merged;

  return getFallbackReviewsForGame(g.title, g.updatedAt.slice(0, 10));
}

/** Site-wide testimonials for homepage — MDX snippets, then approved JSON, then brand padding. */
export function getSiteReviews(): UserReview[] {
  const out: UserReview[] = [];
  const games = getAllGames().filter((g) => g.playerReviews?.length);
  for (const g of games) {
    for (const r of g.playerReviews.slice(0, 2)) {
      out.push({
        name: r.name,
        city: r.place ?? "Pakistan",
        rating: r.rating,
        date: g.updatedAt.slice(0, 10),
        comment: r.text,
        helpful: 20 + out.length,
      });
      if (out.length >= 6) break;
    }
    if (out.length >= 6) break;
  }

  if (out.length < 6) {
    for (const extra of getApprovedSnippetsForHome(6 - out.length)) {
      out.push(extra);
      if (out.length >= 6) break;
    }
  }

  while (out.length < 5) {
    out.push({
      name: "Reader",
      city: "Pakistan",
      rating: 5,
      date: "2026-01-15",
      comment: `${siteConfig.name} surfaces version metadata, mirror hygiene, and JazzCash / EasyPaisa context for Pakistani players—without ad-heavy clutter.`,
      helpful: 12 + out.length,
    });
  }
  return out.slice(0, 6);
}
