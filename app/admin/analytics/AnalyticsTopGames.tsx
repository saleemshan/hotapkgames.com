import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

import { GAMES_PAGE_SIZE, type TopGameRow } from "@/lib/analytics/admin-top-games";
import { cn } from "@/lib/utils";

type AnalyticsTopGamesProps = {
  rows: TopGameRow[];
  page: number;
  totalCount: number;
  pageHref: (page: number) => string;
};

function truncateUrl(url: string, max = 42): string {
  return url.length > max ? `${url.slice(0, max - 1)}…` : url;
}

export function AnalyticsTopGames({ rows, page, totalCount, pageHref }: AnalyticsTopGamesProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / GAMES_PAGE_SIZE));

  if (!totalCount) {
    return (
      <p className="text-sm text-muted-foreground">No download_click rows with game in this window.</p>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {rows.map((row) => {
          const width = Math.max(4, row.pct);

          return (
            <li key={`${row.rank}-${row.game}`} className="rounded-lg transition-colors hover:bg-muted/30">
              <div className="mb-1.5 flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-start gap-2">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold tabular-nums text-muted-foreground">
                    {row.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{row.game}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      {row.page_href ? (
                        <Link
                          href={row.page_href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                          title={row.page_href}
                        >
                          Download page
                          <ExternalLink className="size-3 opacity-70" aria-hidden />
                        </Link>
                      ) : null}
                      {row.download_href ? (
                        <a
                          href={row.download_href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex max-w-full items-center gap-1 truncate text-xs font-medium text-primary hover:underline"
                          title={row.download_href}
                        >
                          Download link
                          <span className="truncate font-normal text-muted-foreground">
                            ({truncateUrl(row.download_href)})
                          </span>
                          <ExternalLink className="size-3 shrink-0 opacity-70" aria-hidden />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-baseline gap-1.5 tabular-nums">
                  <span className="text-sm font-semibold text-foreground">{row.click_count}</span>
                  <span className="text-xs text-muted-foreground">{row.pct}%</span>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted/80">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary/80 to-accent/80"
                  style={{ width: `${width}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <nav
        aria-label="Top games pagination"
        className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4"
      >
        <p className="text-xs text-muted-foreground tabular-nums">
          {totalCount} games · page {page} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <PaginationLink
            href={pageHref(page - 1)}
            disabled={page <= 1}
            label="Previous page"
          >
            <ChevronLeft className="size-4" />
            Prev
          </PaginationLink>
          <PaginationLink
            href={pageHref(page + 1)}
            disabled={page >= totalPages}
            label="Next page"
          >
            Next
            <ChevronRight className="size-4" />
          </PaginationLink>
        </div>
      </nav>
    </div>
  );
}

function PaginationLink({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className="inline-flex h-8 items-center gap-1 rounded-lg border border-border/50 px-3 text-xs font-medium text-muted-foreground/50"
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground transition hover:bg-muted",
      )}
    >
      {children}
    </Link>
  );
}
