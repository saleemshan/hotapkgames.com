import { getAllGames } from "@/lib/content";
import { getPrimaryDownloadUrl } from "@/lib/download-links";

const GAMES_PAGE_SIZE = 10;

export { GAMES_PAGE_SIZE };

export function parseGamesPage(value: string | undefined): number {
  const n = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

/** title (analytics `properties.game`) → site path e.g. `/pk3-game` */
export function buildGameTitlePathMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const game of getAllGames()) {
    map.set(game.title, game.url);
  }
  return map;
}

/** title → primary APK URL from content */
export function buildGameTitleDownloadMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const game of getAllGames()) {
    const url = getPrimaryDownloadUrl(game.downloadLinks);
    if (url) map.set(game.title, url);
  }
  return map;
}

export function resolveGamePageHref(
  gameName: string,
  analyticsPath: string | null | undefined,
  titleToPath: Map<string, string>,
): string | null {
  const fromTitle = titleToPath.get(gameName);
  if (fromTitle) return fromTitle;
  if (analyticsPath?.startsWith("/")) return analyticsPath;
  return null;
}

export function resolveGameDownloadHref(
  gameName: string,
  analyticsUrl: string | null | undefined,
  titleToDownload: Map<string, string>,
): string | null {
  if (analyticsUrl && /^https?:\/\//i.test(analyticsUrl)) return analyticsUrl;
  return titleToDownload.get(gameName) ?? null;
}

export type TopGameRow = {
  game: string;
  click_count: number;
  page_path: string | null;
  page_href: string | null;
  download_href: string | null;
  rank: number;
  pct: number;
};

export function mapTopGameRows(
  rows: {
    game: string;
    click_count: number;
    page_path: string | null;
    download_url: string | null;
  }[],
  page: number,
  topClickCount: number,
  titleToPath: Map<string, string>,
  titleToDownload: Map<string, string>,
): TopGameRow[] {
  const peak = topClickCount || 1;
  const offset = (page - 1) * GAMES_PAGE_SIZE;

  return rows.map((row, index) => ({
    game: row.game,
    click_count: row.click_count,
    page_path: row.page_path,
    page_href: resolveGamePageHref(row.game, row.page_path, titleToPath),
    download_href: resolveGameDownloadHref(row.game, row.download_url, titleToDownload),
    rank: offset + index + 1,
    pct: Math.round((row.click_count / peak) * 100),
  }));
}
