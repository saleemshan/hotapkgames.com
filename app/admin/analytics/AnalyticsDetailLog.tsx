"use client";

import Link from "next/link";
import { ChevronDown, ExternalLink, Search, X } from "lucide-react";
import { Fragment, useMemo, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { eventBadgeClass, eventLabel } from "@/lib/analytics/admin-insights";
import { cn } from "@/lib/utils";

export type DetailRow = {
  id: string;
  created_at: string;
  event_name: string;
  properties: Record<string, unknown>;
};

function propStr(props: Record<string, unknown>, key: string): string {
  const v = props[key];
  if (v == null) return "—";
  if (typeof v === "string") return v.length > 120 ? `${v.slice(0, 117)}…` : v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return "—";
}

function propString(props: Record<string, unknown>, key: string): string | null {
  const v = props[key];
  return typeof v === "string" && v.length > 0 ? v : null;
}

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function truncateLabel(value: string, max = 120): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function AnalyticsLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const linkClass = cn("text-accent underline-offset-2 hover:underline", className);

  if (isHttpUrl(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass} title={href}>
        {children}
        <ExternalLink className="ml-0.5 inline size-3 opacity-60" aria-hidden />
      </a>
    );
  }

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={linkClass} title={href}>
        {children}
      </Link>
    );
  }

  return <span title={href}>{children}</span>;
}

function EventBadge({ name }: { name: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold",
        eventBadgeClass(name),
      )}
    >
      {eventLabel(name)}
    </span>
  );
}

function matchesSearch(row: DetailRow, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const p = row.properties ?? {};
  const haystack = [
    row.event_name,
    propString(p, "path"),
    propString(p, "game"),
    propString(p, "region"),
    propString(p, "deviceType"),
    propString(p, "browser"),
    propString(p, "url"),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

type AnalyticsDetailLogProps = {
  rows: DetailRow[];
  eventNames: string[];
};

export function AnalyticsDetailLog({ rows, eventNames }: AnalyticsDetailLogProps) {
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (eventFilter !== "all" && row.event_name !== eventFilter) return false;
      return matchesSearch(row, search);
    });
  }, [rows, search, eventFilter]);

  if (!rows.length) {
    return <p className="text-sm text-muted-foreground">No rows in this window.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search path, game, region, browser…"
            className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-9 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground tabular-nums">
          Showing {filtered.length} of {rows.length}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip active={eventFilter === "all"} onClick={() => setEventFilter("all")}>
          All events
        </FilterChip>
        {eventNames.map((name) => (
          <FilterChip
            key={name}
            active={eventFilter === name}
            onClick={() => setEventFilter(eventFilter === name ? "all" : name)}
          >
            {eventLabel(name)}
          </FilterChip>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border/80">
        <div className="max-h-[520px] overflow-auto">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm">
              <tr className="border-b border-border text-left">
                <th className="w-8 px-2 py-2.5" aria-label="Expand" />
                <th className="px-3 py-2.5 font-heading text-xs font-semibold">Time (UTC)</th>
                <th className="px-3 py-2.5 font-heading text-xs font-semibold">Event</th>
                <th className="px-3 py-2.5 font-heading text-xs font-semibold">Path</th>
                <th className="px-3 py-2.5 font-heading text-xs font-semibold">Game</th>
                <th className="px-3 py-2.5 font-heading text-xs font-semibold">Region</th>
                <th className="px-3 py-2.5 font-heading text-xs font-semibold">Device</th>
                <th className="px-3 py-2.5 font-heading text-xs font-semibold">Dup?</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const p = r.properties ?? {};
                const path = propString(p, "path");
                const url = propString(p, "url");
                const idx = p.index;
                const hasMirrorIndex = typeof idx === "number";
                const isExpanded = expandedId === r.id;

                return (
                  <Fragment key={r.id}>
                    <tr
                      className={cn(
                        "border-b border-border/60 align-top transition-colors hover:bg-muted/30",
                        isExpanded && "bg-muted/20",
                      )}
                    >
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : r.id)}
                          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-expanded={isExpanded}
                          aria-label={isExpanded ? "Collapse row" : "Expand row"}
                        >
                          <ChevronDown
                            className={cn("size-4 transition-transform", isExpanded && "rotate-180")}
                          />
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-[11px] text-muted-foreground">
                        {r.created_at?.replace("T", " ").replace(/\.\d{3}Z$/, " Z") ?? "—"}
                      </td>
                      <td className="px-3 py-2">
                        <EventBadge name={r.event_name} />
                      </td>
                      <td className="max-w-[160px] truncate px-3 py-2 text-xs text-muted-foreground">
                        {path ? (
                          <AnalyticsLink href={path} className="block truncate">
                            {truncateLabel(path, 52)}
                          </AnalyticsLink>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="max-w-[140px] truncate px-3 py-2 text-xs font-medium">
                        {propStr(p, "game")}
                      </td>
                      <td className="max-w-[120px] truncate px-3 py-2 text-xs text-muted-foreground">
                        {propStr(p, "region")}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2">
                        <Badge variant="outline" className="text-[10px]">
                          {propStr(p, "deviceType")}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-xs">
                        {p.isDuplicate === "Yes" ? (
                          <Badge variant="secondary" className="text-[10px]">
                            Repeat
                          </Badge>
                        ) : p.isDuplicate === "No" ? (
                          <Badge variant="default" className="bg-accent/90 text-[10px]">
                            First
                          </Badge>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                    {isExpanded ? (
                      <tr className="border-b border-border/60 bg-muted/10">
                        <td colSpan={8} className="px-4 py-3">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <DetailField label="Browser" value={propStr(p, "browser")} />
                            <DetailField label="Language" value={propStr(p, "language")} />
                            <DetailField label="Referrer" value={propStr(p, "referrer")} />
                            <DetailField label="Click count" value={propStr(p, "clickCount")} />
                            {hasMirrorIndex ? (
                              <DetailField label="Mirror" value={`#${(idx as number) + 1}`} />
                            ) : null}
                            {url ? (
                              <div className="sm:col-span-2">
                                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                  Download URL
                                </p>
                                <AnalyticsLink href={url} className="break-all text-xs">
                                  {url}
                                </AnalyticsLink>
                              </div>
                            ) : null}
                          </div>
                          <details className="mt-3">
                            <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
                              Raw properties JSON
                            </summary>
                            <pre className="mt-2 max-h-40 overflow-auto rounded-lg border border-border bg-background p-3 font-mono text-[11px] text-muted-foreground">
                              {JSON.stringify(p, null, 2)}
                            </pre>
                          </details>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        {!filtered.length ? (
          <p className="border-t border-border px-4 py-8 text-center text-sm text-muted-foreground">
            No events match your search or filter.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}
