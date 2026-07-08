import { absoluteUrl } from "@/lib/seo";

import { JsonLd } from "@/components/seo/JsonLd";

const MIN_VOTES_FOR_AGGREGATE_RATING = 5;
const MAX_SCREENSHOTS = 8;
const BEST_RATING = 5;
const WORST_RATING = 1;

function toIsoDate(d: string | Date | undefined): string | undefined {
  if (d == null) return undefined;
  const t = new Date(d).getTime();
  if (!Number.isFinite(t)) return undefined;
  return new Date(t).toISOString();
}

function appCategoryToSchema(category: string): string {
  switch (category) {
    case "injectors":
      return "DeveloperApplication";
    case "tools":
    case "utilities":
      return "UtilitiesApplication";
    case "apps":
    default:
      return "MobileApplication";
  }
}

/** Google-rich-result-safe aggregate: numeric bounds, positive integer count, single parent @type. */
function buildAggregateRatingBlock(
  rating: number,
  votes: number,
): Record<string, unknown> | null {
  const voteInt = Math.floor(Number(votes));
  if (!Number.isFinite(voteInt) || voteInt < MIN_VOTES_FOR_AGGREGATE_RATING) {
    return null;
  }
  let rv = Number(rating);
  if (!Number.isFinite(rv)) return null;
  rv = Math.min(BEST_RATING, Math.max(WORST_RATING, rv));
  const rounded = Math.round(rv * 10) / 10;
  return {
    "@type": "AggregateRating",
    ratingValue: rounded,
    bestRating: BEST_RATING,
    worstRating: WORST_RATING,
    ratingCount: Math.max(1, voteInt),
  };
}

export function SoftwareApplicationJsonLd({
  name,
  description,
  slugPath,
  rating,
  votes,
  kind,
  coverImage,
  screenshots = [],
  softwareVersion,
  fileSize,
  datePublished,
  dateModified,
  tags = [],
  categoryKey,
}: {
  name: string;
  description: string;
  slugPath: string;
  rating: number;
  votes: number;
  kind: "game" | "app";
  coverImage?: string;
  screenshots?: string[];
  softwareVersion?: string;
  /** Human-readable size from listing (e.g. `25MB`). */
  fileSize?: string;
  datePublished?: string | Date;
  dateModified?: string | Date;
  tags?: string[];
  /** Contentlayer `category` enum value — drives `applicationCategory` for apps. */
  categoryKey?: string;
}) {
  const published = toIsoDate(datePublished);
  const modified = toIsoDate(dateModified);
  const shotUrls = screenshots
    .slice(0, MAX_SCREENSHOTS)
    .map((u) => absoluteUrl(u));
  const keywordParts = [
    ...tags,
    ...(categoryKey && kind === "game" ? [categoryKey.replace(/-/g, " ")] : []),
    ...(categoryKey && kind === "app" ? [categoryKey] : []),
  ];
  const keywords =
    keywordParts.length > 0
      ? keywordParts.map((s) => s.trim()).filter(Boolean).join(", ")
      : undefined;

  const applicationCategory =
    kind === "game"
      ? "GameApplication"
      : appCategoryToSchema(categoryKey ?? "apps");

  // SEO FIX: Single concrete @type (no array) — avoids GSC treating aggregateRating like orphan Review snippets (itemReviewed errors).
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": kind === "game" ? "MobileApplication" : "SoftwareApplication",
    name,
    operatingSystem: "Android",
    applicationCategory,
    description,
    url: absoluteUrl(slugPath),
    inLanguage: "en-PK",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "PKR",
    },
  };

  if (coverImage) data.image = absoluteUrl(coverImage);
  if (shotUrls.length) data.screenshot = shotUrls;
  if (softwareVersion) data.softwareVersion = softwareVersion;
  if (fileSize?.trim()) data.fileSize = fileSize.trim();
  if (published) data.datePublished = published;
  if (modified) data.dateModified = modified;
  if (keywords) data.keywords = keywords;

  const agg = buildAggregateRatingBlock(rating, votes);
  if (agg) data.aggregateRating = agg;

  return <JsonLd data={data} />;
}
