export type AnalyticsRange = "day" | "week" | "month";

export function parseAnalyticsRange(value: string | undefined): AnalyticsRange {
  if (value === "day" || value === "week" || value === "month") return value;
  return "week";
}

/** Postgres interval passed to analytics_* RPCs */
export function rpcIntervalSince(range: AnalyticsRange): string {
  switch (range) {
    case "day":
      return "1 day";
    case "week":
      return "7 days";
    case "month":
      return "30 days";
  }
}

export function rangeWindowLabel(range: AnalyticsRange): string {
  switch (range) {
    case "day":
      return "Last 24 hours";
    case "week":
      return "Last 7 days";
    case "month":
      return "Last 30 days";
  }
}

/** ISO cutoff for row-level `.gte('created_at', …)` queries */
export function createdAtCutoffIso(range: AnalyticsRange): string {
  const ms =
    range === "day" ? 864e5 : range === "week" ? 7 * 864e5 : 30 * 864e5;
  return new Date(Date.now() - ms).toISOString();
}
