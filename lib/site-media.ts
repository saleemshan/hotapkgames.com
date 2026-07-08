/**
 * Central marketing imagery. Hero file lives in `public/images/hero/`.
 *
 * Re-optimize after replacing the source bitmap:
 * `node scripts/optimize-hero.mjs`
 */
export const SITE_HERO_IMAGE = {
  src: "/images/hero/hero-hotapk-games.webp",
  alt: "HotAPK Games — Pakistan earning games and APK download platform branding",
} as const;

export type SiteLogoVariant = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

/** Dark UI — bright controller mark. Rebuild: `pnpm run optimize:logo`. */
export const SITE_LOGO_DARK: SiteLogoVariant = {
  src: "/images/brand/hotapk-games-logo-dark.png",
  width: 125,
  height: 160,
  alt: "HotAPK Games",
};

/** Light UI — deep blue controller mark. */
export const SITE_LOGO_LIGHT: SiteLogoVariant = {
  src: "/images/brand/hotapk-games-logo-light.png",
  width: 123,
  height: 160,
  alt: "HotAPK Games",
};

/** Default for JSON-LD / OG fallbacks (dark variant). */
export const SITE_LOGO = SITE_LOGO_DARK;

export function getSiteLogoForTheme(theme: "dark" | "light"): SiteLogoVariant {
  return theme === "light" ? SITE_LOGO_LIGHT : SITE_LOGO_DARK;
}
