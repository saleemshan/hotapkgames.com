import type { AnalyticsRange } from "@/lib/analytics/admin-range";

export type InsightRow = {
  created_at: string;
  event_name: string;
  properties: Record<string, unknown>;
};

export type TimelineBucket = {
  label: string;
  count: number;
  key: string;
};

export type BreakdownItem = {
  label: string;
  count: number;
  pct: number;
};

export type AnalyticsKpis = {
  totalEvents: number;
  downloadClicks: number;
  mirrorClicks: number;
  ctaClicks: number;
  firstTimeRate: number;
  mobileShare: number;
  topGame: string | null;
  topGameClicks: number;
  filteredLogCount: number;
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function countByProperty(
  rows: InsightRow[],
  key: string,
  limit = 8,
): BreakdownItem[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const raw = row.properties?.[key];
    if (typeof raw !== "string" || !raw.trim()) continue;
    const label = raw.trim();
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  const total = [...counts.values()].reduce((a, b) => a + b, 0) || 1;
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({
      label,
      count,
      pct: Math.round((count / total) * 100),
    }));
}

export function bucketTimeline(rows: InsightRow[], range: AnalyticsRange): TimelineBucket[] {
  const now = new Date();
  const buckets = new Map<string, number>();
  const order: { key: string; label: string }[] = [];

  if (range === "day") {
    for (let i = 23; i >= 0; i--) {
      const d = new Date(now);
      d.setUTCMinutes(0, 0, 0);
      d.setUTCHours(d.getUTCHours() - i);
      const key = d.toISOString().slice(0, 13);
      order.push({ key, label: `${d.getUTCHours().toString().padStart(2, "0")}h` });
      buckets.set(key, 0);
    }
  } else {
    const days = range === "week" ? 7 : 30;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setUTCHours(0, 0, 0, 0);
      d.setUTCDate(d.getUTCDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label =
        range === "week"
          ? DAY_LABELS[d.getUTCDay()]
          : d.toISOString().slice(5, 10);
      order.push({ key, label });
      buckets.set(key, 0);
    }
  }

  for (const row of rows) {
    const key = range === "day" ? row.created_at.slice(0, 13) : row.created_at.slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return order.map(({ key, label }) => ({
    key,
    label,
    count: buckets.get(key) ?? 0,
  }));
}

export function computeKpis(
  summary: { event_name: string; event_count: number }[],
  games: { game: string; click_count: number }[],
  insightRows: InsightRow[],
  filteredLogCount: number,
): AnalyticsKpis {
  const byEvent = new Map(summary.map((r) => [r.event_name, r.event_count]));
  const downloadClicks = byEvent.get("download_click") ?? 0;
  const mirrorClicks = byEvent.get("download_mirror_click") ?? 0;
  const ctaClicks = byEvent.get("download_cta_click") ?? 0;
  const totalEvents = summary.reduce((acc, r) => acc + r.event_count, 0);

  let firstTime = 0;
  let withDupFlag = 0;
  let mobile = 0;
  let withDevice = 0;

  for (const row of insightRows) {
    const dup = row.properties?.isDuplicate;
    if (dup === "Yes" || dup === "No") {
      withDupFlag++;
      if (dup === "No") firstTime++;
    }
    const device = row.properties?.deviceType;
    if (device === "Mobile" || device === "Desktop") {
      withDevice++;
      if (device === "Mobile") mobile++;
    }
  }

  const topGame = games[0]?.game ?? null;
  const topGameClicks = games[0]?.click_count ?? 0;

  return {
    totalEvents,
    downloadClicks,
    mirrorClicks,
    ctaClicks,
    firstTimeRate: withDupFlag ? Math.round((firstTime / withDupFlag) * 100) : 0,
    mobileShare: withDevice ? Math.round((mobile / withDevice) * 100) : 0,
    topGame,
    topGameClicks,
    filteredLogCount,
  };
}

export function eventLabel(name: string): string {
  switch (name) {
    case "download_click":
      return "APK download";
    case "download_mirror_click":
      return "Mirror link";
    case "download_cta_click":
      return "Download CTA";
    default:
      return name.replace(/_/g, " ");
  }
}

export function eventBadgeClass(name: string): string {
  switch (name) {
    case "download_click":
      return "bg-accent/15 text-accent border-accent/30";
    case "download_mirror_click":
      return "bg-primary/15 text-primary border-primary/30";
    case "download_cta_click":
      return "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function rankedWithPct<T extends { count: number }>(
  rows: T[],
  total: number,
): (T & { pct: number })[] {
  const denom = total || 1;
  return rows.map((r) => ({ ...r, pct: Math.round((r.count / denom) * 100) }));
}
