"use client";

import { useMemo, useState } from "react";

import type { TimelineBucket } from "@/lib/analytics/admin-insights";
import { cn } from "@/lib/utils";

type AnalyticsTimelineChartProps = {
  buckets: TimelineBucket[];
  rangeLabel: string;
};

export function AnalyticsTimelineChart({ buckets, rangeLabel }: AnalyticsTimelineChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = useMemo(() => Math.max(...buckets.map((b) => b.count), 1), [buckets]);
  const total = useMemo(() => buckets.reduce((a, b) => a + b.count, 0), [buckets]);
  const peakIdx = useMemo(() => {
    let best = 0;
    buckets.forEach((b, i) => {
      if (b.count > buckets[best].count) best = i;
    });
    return best;
  }, [buckets]);

  if (!buckets.length) {
    return <p className="text-sm text-muted-foreground">No activity in this window.</p>;
  }

  const active = hovered ?? peakIdx;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Peak · {buckets[active]?.label}
          </p>
          <p className="font-heading text-2xl font-bold tabular-nums text-foreground">
            {buckets[active]?.count ?? 0}
            <span className="ml-2 text-sm font-normal text-muted-foreground">events</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">{rangeLabel}</p>
          <p className="text-sm font-semibold tabular-nums text-foreground">{total} total</p>
        </div>
      </div>

      <div
        className="flex items-end gap-1 sm:gap-1.5"
        role="img"
        aria-label={`Activity timeline, ${total} events`}
      >
        {buckets.map((bucket, i) => {
          const height = bucket.count === 0 ? 4 : Math.max(12, Math.round((bucket.count / max) * 100));
          const isActive = i === active;

          return (
            <div
              key={bucket.key}
              className="group flex flex-1 flex-col items-center gap-1.5"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span
                className={cn(
                  "text-[10px] font-medium tabular-nums transition-opacity sm:text-xs",
                  isActive ? "text-foreground opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-100",
                )}
              >
                {bucket.count || ""}
              </span>
              <div
                className={cn(
                  "w-full rounded-t-md transition-all",
                  bucket.count === 0 ? "bg-muted" : "bg-gradient-to-t from-primary/70 to-accent/90",
                  isActive && "ring-2 ring-accent/40 ring-offset-1 ring-offset-background",
                )}
                style={{ height: `${height}px` }}
                title={`${bucket.label}: ${bucket.count} events`}
              />
              <span
                className={cn(
                  "max-w-full truncate text-[9px] text-muted-foreground sm:text-[10px]",
                  buckets.length > 14 && i % 2 === 1 && "hidden sm:inline",
                  buckets.length > 14 && i % 3 !== 0 && "hidden lg:inline",
                )}
              >
                {bucket.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
