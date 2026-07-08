import Link from "next/link";
import { Suspense } from "react";
import { Activity, BarChart3, ListTree } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type AnalyticsRange,
  createdAtCutoffIso,
  parseAnalyticsRange,
  rangeWindowLabel,
  rpcIntervalSince,
} from "@/lib/analytics/admin-range";
import {
  bucketTimeline,
  computeKpis,
  countByProperty,
  eventBadgeClass,
  eventLabel,
  type InsightRow,
  rankedWithPct,
} from "@/lib/analytics/admin-insights";
import { createServiceSupabase } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

import {
  buildGameTitlePathMap,
  buildGameTitleDownloadMap,
  GAMES_PAGE_SIZE,
  mapTopGameRows,
  parseGamesPage,
} from "@/lib/analytics/admin-top-games";

import { AnalyticsBarList, type BarListItem } from "./AnalyticsBarList";
import { AnalyticsBreakdownPanel } from "./AnalyticsBreakdownPanel";
import { AnalyticsDetailLog, type DetailRow } from "./AnalyticsDetailLog";
import { AnalyticsFilters } from "./AnalyticsFilters";
import { AnalyticsKpiGrid } from "./AnalyticsKpiGrid";
import { AnalyticsTimelineChart } from "./AnalyticsTimelineChart";
import { AnalyticsTopGames } from "./AnalyticsTopGames";

export const dynamic = "force-dynamic";

function num(n: number | string | null | undefined): number {
  if (n == null) return 0;
  const x = typeof n === "string" ? Number(n) : n;
  return Number.isFinite(x) ? x : 0;
}

type SearchParams = {
  range?: string;
  deviceType?: string;
  isDuplicate?: string;
  region?: string;
  browser?: string;
  gamesPage?: string;
};

function buildAnalyticsHref(
  sp: SearchParams,
  overrides?: Partial<{ range: AnalyticsRange; gamesPage: number }>,
): string {
  const params = new URLSearchParams();
  const range = overrides?.range ?? parseAnalyticsRange(sp.range);
  params.set("range", range);
  if (sp.deviceType) params.set("deviceType", sp.deviceType);
  if (sp.isDuplicate) params.set("isDuplicate", sp.isDuplicate);
  if (sp.region) params.set("region", sp.region);
  if (sp.browser) params.set("browser", sp.browser);
  const gamesPage = overrides?.gamesPage ?? parseGamesPage(sp.gamesPage);
  if (gamesPage > 1) params.set("gamesPage", String(gamesPage));
  return `/admin/analytics?${params.toString()}`;
}

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const range = parseAnalyticsRange(sp.range);
  const gamesPage = parseGamesPage(sp.gamesPage);
  const interval = rpcIntervalSince(range);
  const windowLabel = rangeWindowLabel(range);
  const cutoffIso = createdAtCutoffIso(range);
  const titleToPath = buildGameTitlePathMap();
  const titleToDownload = buildGameTitleDownloadMap();

  let summary: { event_name: string; event_count: number }[] = [];
  let gamesPageRows: {
    game: string;
    click_count: number;
    page_path: string | null;
    download_url: string | null;
  }[] = [];
  let gamesTotalCount = 0;
  let topGameClickCount = 0;
  let leaderGame: { game: string; click_count: number } | null = null;
  let details: DetailRow[] = [];
  let insightRows: InsightRow[] = [];
  let loadError: string | null = null;

  try {
    const sb = createServiceSupabase();

    let detailsQuery = sb
      .from("analytics_events")
      .select("id, created_at, event_name, properties")
      .gte("created_at", cutoffIso);

    if (sp.deviceType) detailsQuery = detailsQuery.eq("properties->>deviceType", sp.deviceType);
    if (sp.isDuplicate) detailsQuery = detailsQuery.eq("properties->>isDuplicate", sp.isDuplicate);
    if (sp.region) detailsQuery = detailsQuery.eq("properties->>region", sp.region);
    if (sp.browser) detailsQuery = detailsQuery.eq("properties->>browser", sp.browser);

    detailsQuery = detailsQuery.order("created_at", { ascending: false }).limit(400);

    const gamesOffset = (gamesPage - 1) * GAMES_PAGE_SIZE;

    const [rs, rgLeader, rgPage, rd, ri] = await Promise.all([
      sb.rpc("analytics_summary", { p_since: interval }),
      sb.rpc("analytics_top_download_games", { p_since: interval, p_limit: 1, p_offset: 0 }),
      sb.rpc("analytics_top_download_games", {
        p_since: interval,
        p_limit: GAMES_PAGE_SIZE,
        p_offset: gamesOffset,
      }),
      detailsQuery,
      sb
        .from("analytics_events")
        .select("created_at, event_name, properties")
        .gte("created_at", cutoffIso)
        .order("created_at", { ascending: false })
        .limit(5000),
    ]);

    if (rs.error) throw new Error(rs.error.message);
    if (rgLeader.error) throw new Error(rgLeader.error.message);
    if (rgPage.error) throw new Error(rgPage.error.message);
    if (rd.error) throw new Error(rd.error.message);
    if (ri.error) throw new Error(ri.error.message);

    summary = (rs.data ?? []).map((row: { event_name: string; event_count: number | string }) => ({
      event_name: row.event_name,
      event_count: num(row.event_count),
    }));

    type GameRpcRow = {
      game: string;
      click_count: number | string;
      page_path: string | null;
      download_url: string | null;
      total_count: number | string;
    };

    const pageData = (rgPage.data ?? []) as GameRpcRow[];
    gamesPageRows = pageData.map((row) => ({
      game: row.game,
      click_count: num(row.click_count),
      page_path: row.page_path,
      download_url: row.download_url,
    }));
    gamesTotalCount = num(pageData[0]?.total_count);

    const leader = (rgLeader.data?.[0] ?? null) as GameRpcRow | null;
    topGameClickCount = num(leader?.click_count);
    leaderGame = leader ? { game: leader.game, click_count: topGameClickCount } : null;
    details = (rd.data ?? []) as DetailRow[];
    insightRows = (ri.data ?? []) as InsightRow[];
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Failed to load analytics";
  }

  const kpis = computeKpis(
    summary,
    leaderGame ? [leaderGame] : [],
    insightRows,
    details.length,
  );
  const timeline = bucketTimeline(insightRows, range);
  const devices = countByProperty(insightRows, "deviceType", 6);
  const browsers = countByProperty(insightRows, "browser", 8);
  const regions = countByProperty(insightRows, "region", 8);
  const totalEvents = kpis.totalEvents;

  const eventItems: BarListItem[] = rankedWithPct(
    summary.map((r) => ({ id: r.event_name, label: eventLabel(r.event_name), count: r.event_count, badgeClass: eventBadgeClass(r.event_name) })),
    totalEvents,
  );

  const topGameRows = mapTopGameRows(
    gamesPageRows,
    gamesPage,
    topGameClickCount,
    titleToPath,
    titleToDownload,
  );

  const eventNames = summary.map((r) => r.event_name);

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 via-background to-background">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 pb-16 sm:px-6">
        <header className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 size-40 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
                Admin dashboard
              </p>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Analytics
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Download funnels, device mix, and live event stream from Supabase —{" "}
                {windowLabel.toLowerCase()}.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <RangeSwitcher current={range} sp={sp} />
              <Link
                href="/"
                className="inline-flex h-9 items-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                Back to site
              </Link>
            </div>
          </div>
        </header>

        {loadError ? (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-base text-destructive">Could not load data</CardTitle>
              <CardDescription>{loadError}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Confirm migration applied and{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_URL</code> +{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
                are set.
              </p>
            </CardContent>
          </Card>
        ) : null}

        {!loadError ? (
          <>
            <AnalyticsKpiGrid kpis={kpis} windowLabel={windowLabel} />

            <Card className="overflow-hidden border-border/80">
              <CardHeader className="border-b border-border/60 bg-muted/20 pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="size-5 text-accent" aria-hidden />
                  <div>
                    <CardTitle className="font-heading text-lg">Activity timeline</CardTitle>
                    <CardDescription>Event volume over {windowLabel.toLowerCase()} · hover bars for counts</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <AnalyticsTimelineChart buckets={timeline} rangeLabel={windowLabel} />
              </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-5">
              <Card className="border-border/80 xl:col-span-2">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="size-5 text-primary" aria-hidden />
                    <div>
                      <CardTitle className="font-heading text-lg">Audience breakdown</CardTitle>
                      <CardDescription>Click a segment to filter the log below</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<PanelSkeleton />}>
                    <AnalyticsBreakdownPanel devices={devices} browsers={browsers} regions={regions} />
                  </Suspense>
                </CardContent>
              </Card>

              <div className="grid gap-6 xl:col-span-3">
                <Card className="border-border/80">
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">Events by type</CardTitle>
                    <CardDescription>{windowLabel} · share of all events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnalyticsBarList
                      items={eventItems}
                      emptyMessage="No events in this window."
                      maxBarPct={100}
                    />
                  </CardContent>
                </Card>

                <Card className="border-border/80">
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">Top games</CardTitle>
                    <CardDescription>
                      <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">download_click</code>
                      {" "}· {GAMES_PAGE_SIZE} per page · bars relative to #1
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnalyticsTopGames
                      rows={topGameRows}
                      page={gamesPage}
                      totalCount={gamesTotalCount}
                      pageHref={(page) => buildAnalyticsHref(sp, { gamesPage: page })}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="border-border/80">
              <CardHeader className="border-b border-border/60 bg-muted/20">
                <div className="flex items-center gap-2">
                  <ListTree className="size-5 text-foreground/70" aria-hidden />
                  <div>
                    <CardTitle className="font-heading text-lg">Event log</CardTitle>
                    <CardDescription>
                      Search, expand rows for full context · UTC timestamps · max 400 rows
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-5">
                <Suspense fallback={<PanelSkeleton tall />}>
                  <AnalyticsFilters />
                </Suspense>
                <AnalyticsDetailLog rows={details} eventNames={eventNames} />
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  );
}

function RangeSwitcher({ current, sp }: { current: AnalyticsRange; sp: SearchParams }) {
  const opts: { value: AnalyticsRange; label: string }[] = [
    { value: "day", label: "24h" },
    { value: "week", label: "7d" },
    { value: "month", label: "30d" },
  ];
  return (
    <nav
      aria-label="Time range"
      className="inline-flex rounded-lg border border-border bg-background p-1 shadow-sm"
    >
      {opts.map((o) => (
        <Link
          key={o.value}
          href={buildAnalyticsHref(sp, { range: o.value, gamesPage: 1 })}
          prefetch={false}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-heading font-semibold transition-colors",
            current === o.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {o.label}
        </Link>
      ))}
    </nav>
  );
}

function PanelSkeleton({ tall }: { tall?: boolean }) {
  return (
    <div className={cn("animate-pulse space-y-3 rounded-lg bg-muted/40", tall ? "h-28" : "h-40")} />
  );
}
