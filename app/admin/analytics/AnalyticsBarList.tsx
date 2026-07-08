"use client";

import { cn } from "@/lib/utils";

export type BarListItem = {
  id: string;
  label: string;
  count: number;
  pct: number;
  meta?: string;
  badgeClass?: string;
};

type AnalyticsBarListProps = {
  items: BarListItem[];
  emptyMessage?: string;
  onItemClick?: (item: BarListItem) => void;
  maxBarPct?: number;
};

export function AnalyticsBarList({
  items,
  emptyMessage = "No data in this window.",
  onItemClick,
  maxBarPct,
}: AnalyticsBarListProps) {
  if (!items.length) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  const peak = maxBarPct ?? Math.max(...items.map((i) => i.pct), 1);

  return (
    <ul className="space-y-3">
      {items.map((item, index) => {
        const width = Math.max(4, Math.round((item.pct / peak) * 100));
        const interactive = Boolean(onItemClick);

        return (
          <li key={item.id}>
            <button
              type="button"
              disabled={!interactive}
              onClick={() => onItemClick?.(item)}
              className={cn(
                "group w-full rounded-lg text-left transition-colors",
                interactive && "cursor-pointer hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                !interactive && "cursor-default",
              )}
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold tabular-nums text-muted-foreground">
                    {index + 1}
                  </span>
                  <span
                    className={cn(
                      "truncate text-sm font-medium text-foreground",
                      item.badgeClass && "rounded-md border px-1.5 py-0.5 text-xs font-semibold",
                      item.badgeClass,
                    )}
                  >
                    {item.label}
                  </span>
                  {item.meta ? (
                    <span className="hidden truncate text-xs text-muted-foreground sm:inline">
                      {item.meta}
                    </span>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-baseline gap-1.5 tabular-nums">
                  <span className="text-sm font-semibold text-foreground">{item.count}</span>
                  <span className="text-xs text-muted-foreground">{item.pct}%</span>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted/80">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary/80 to-accent/80 transition-all group-hover:from-primary group-hover:to-accent"
                  style={{ width: `${width}%` }}
                />
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
