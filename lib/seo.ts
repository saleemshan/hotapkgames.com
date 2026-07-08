import type { Metadata } from "next";

// SEO FIX: Matches primary content CDN / brand host used in MDX cover images.
const PRODUCTION_FALLBACK_ORIGIN = "https://hotapkgames.com";

export const siteConfig = {
  name: "HotAPK Games",
  shortName: "HotAPK Games",
  /** Full `<title>` / OG default — includes brand once. Child routes use `title.absolute` or template segment without brand. */
  defaultTitle:
    "HotAPK Games | Best Earning Games & APK Downloads Pakistan 2026",
  description:
    "HotAPK Games is Pakistan's trusted directory for real-money gaming APK reviews — casino, colour prediction, and card-room apps with JazzCash and EasyPaisa guides.",
  locale: "en_PK",
} as const;

export const SITE_NAME = siteConfig.name;

/** Calendar year for metadata freshness (not app version data). */
export function getMetadataYear(now = new Date()): number {
  return now.getFullYear();
}

/** True if listing text mentions JazzCash / EasyPaisa (editorial + body, not invented). */
export function textMentionsPakistanWallets(text: string): boolean {
  return /jazz\s*cash|easypaisa|easy\s*paisa/i.test(text);
}

type GameMetaFields = {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  version: string;
  size: string;
  requirements: string;
  body?: { raw: string };
};

export function buildGameMetaTitle(game: GameMetaFields): string {
  const y = getMetadataYear();
  return `${game.title} APK Download Pakistan ${y} — Review & Install Guide`;
}

export function buildGameMetaDescription(game: GameMetaFields): string {
  const raw = `${game.shortDescription}\n${game.description}\n${game.body?.raw ?? ""}`;
  const wallets = textMentionsPakistanWallets(raw);
  const cat =
    game.category === "casino-games"
      ? "Casino"
      : game.category === "color-prediction"
        ? "Color prediction"
        : game.category === "sports-betting"
          ? "Sports betting"
          : "Card-room";
  const walletClause = wallets
    ? " JazzCash / EasyPaisa withdrawal context where noted in our review."
    : " Wallet and withdrawal steps vary by publisher—confirm in-app.";
  return `Download ${game.title} for Android (${game.version}, ${game.size}, ${game.requirements}). ${cat} APK review with install steps,${walletClause} Safety tips for Pakistan.`;
}

type AppMetaFields = Pick<GameMetaFields, "title" | "shortDescription">;

export function buildAppMetaTitle(app: AppMetaFields): string {
  const y = getMetadataYear();
  return `${app.title} APK Download Pakistan ${y} — Tools & Utilities`;
}

export function buildAppMetaDescription(app: AppMetaFields): string {
  return `${app.shortDescription} Version and size on page are from our listing metadata—verify after download before install.`;
}

/** Relative path for default OG image (composed with metadataBase). */
export function getDefaultOgImagePath(): string {
  return `/api/og?title=${encodeURIComponent(siteConfig.name)}`;
}

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  // SEO FIX: Vercel provides a canonical host when NEXT_PUBLIC_SITE_URL is unset.
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  return PRODUCTION_FALLBACK_ORIGIN;
}

/** Absolute site origin for share URLs and ported EarningGames UI (evaluated at module load). */
export const BASE_URL = getSiteUrl();

/** Stable JSON-LD `@id` values (match root layout `Organization` / `WebSite` graph). */
export function getOrganizationSchemaId(): string {
  return `${getSiteUrl().replace(/\/$/, "")}/#organization`;
}

export function getWebsiteSchemaId(): string {
  return `${getSiteUrl().replace(/\/$/, "")}/#website`;
}

export function getContactEmail(): string {
  return (
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "contact@hotapkgames.com"
  );
}

/** Optional profile URLs for Organization sameAs (comma-separated in env). */
export function getOrgSameAs(): string[] {
  const raw = process.env.NEXT_PUBLIC_ORG_SAME_AS?.trim();
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

/** Google Search Console HTML tag verification (`<meta name="google-site-verification">`). */
export function getGoogleSiteVerification(): string {
  const fromEnv = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
  if (fromEnv) return fromEnv;
  return "LN9scHeHRieDWfE7UXTKE30fsUaQxY5T1_CBqwQP6HA";
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (path.startsWith("http")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

// SEO FIX: Stable, self-referencing listing URLs for canonicals (sorted query keys).
export function buildListingSearchPath(
  pathname: string,
  opts: { category?: string; sort?: string; page?: number },
): string {
  const sp = new URLSearchParams();
  if (opts.category) sp.set("category", opts.category);
  if (opts.sort && opts.sort !== "latest") sp.set("sort", opts.sort);
  if (opts.page && opts.page > 1) sp.set("page", String(opts.page));
  const q = sp.toString();
  return q ? `${pathname}?${q}` : pathname;
}

const EARNING_CATEGORY_LABELS: Record<string, string> = {
  "casino-games": "Casino Games",
  "color-prediction": "Color Prediction",
  "card-games": "Card Games",
  "sports-betting": "Sports Betting",
};

/** Labels for migrated `/category/[slug]` IA (EarningGamesApk parity). */
export function getCategoryLabel(category: string): string {
  return EARNING_CATEGORY_LABELS[category] ?? category.replace(/-/g, " ");
}

export function generateCategoryMetadata(
  category: string,
  page: number = 1,
): Metadata {
  const label = getCategoryLabel(category);
  const path =
    page > 1 ? `/category/${category}/page/${page}` : `/category/${category}`;
  const canonical = absoluteUrl(path);
  const title =
    page > 1
      ? `${label} – Page ${page} | ${siteConfig.name}`
      : `${label} – Download Best APKs Pakistan | ${siteConfig.name}`;
  return {
    title,
    description: `Browse and download the best ${label.toLowerCase()} APKs for Pakistan. Verified safe downloads, updated daily.`,
    alternates: { canonical },
    openGraph: {
      title,
      description: `Browse verified ${label.toLowerCase()} APKs for Pakistan.`,
      url: canonical,
      siteName: siteConfig.name,
    },
    robots:
      page > 2 ? { index: false, follow: true } : { index: true, follow: true },
  };
}
