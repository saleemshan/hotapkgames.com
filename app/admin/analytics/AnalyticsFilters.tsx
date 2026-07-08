"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const BROWSER_OPTIONS = ["Chrome", "Safari", "Firefox", "Edge", "Opera", "IE", "Other"] as const;

export function AnalyticsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const deviceType = searchParams.get("deviceType") || "";
  const isDuplicate = searchParams.get("isDuplicate") || "";
  const region = searchParams.get("region") || "";
  const browser = searchParams.get("browser") || "";

  const [regionDraft, setRegionDraft] = useState(region);

  useEffect(() => {
    setRegionDraft(region);
  }, [region]);

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const clearAll = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("deviceType");
    params.delete("isDuplicate");
    params.delete("region");
    params.delete("browser");
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (regionDraft !== region) setFilter("region", regionDraft);
    }, 400);
    return () => clearTimeout(t);
  }, [regionDraft, region, setFilter]);

  const activeCount = [deviceType, isDuplicate, region, browser].filter(Boolean).length;

  return (
    <div className="mb-5 space-y-3 rounded-xl border border-border/80 bg-muted/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Filter className="size-4 text-muted-foreground" aria-hidden />
          Event log filters
        </div>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-xs font-medium text-destructive hover:underline"
          >
            <X className="size-3" />
            Clear all ({activeCount})
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Region</span>
          <input
            type="text"
            placeholder="e.g. Asia/Karachi"
            value={regionDraft}
            onChange={(e) => setRegionDraft(e.target.value)}
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Device</span>
          <select
            value={deviceType}
            onChange={(e) => setFilter("deviceType", e.target.value)}
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm"
          >
            <option value="">All devices</option>
            <option value="Mobile">Mobile</option>
            <option value="Desktop">Desktop</option>
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Visit type</span>
          <select
            value={isDuplicate}
            onChange={(e) => setFilter("isDuplicate", e.target.value)}
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm"
          >
            <option value="">All visits</option>
            <option value="No">First-time only</option>
            <option value="Yes">Repeat only</option>
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Browser</span>
          <select
            value={browser}
            onChange={(e) => setFilter("browser", e.target.value)}
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm"
          >
            <option value="">All browsers</option>
            {BROWSER_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
      </div>

      {activeCount > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {deviceType ? (
            <ActivePill label={`Device: ${deviceType}`} onRemove={() => setFilter("deviceType", "")} />
          ) : null}
          {isDuplicate ? (
            <ActivePill
              label={isDuplicate === "No" ? "First-time" : "Repeat"}
              onRemove={() => setFilter("isDuplicate", "")}
            />
          ) : null}
          {region ? (
            <ActivePill label={`Region: ${region}`} onRemove={() => setFilter("region", "")} />
          ) : null}
          {browser ? (
            <ActivePill label={`Browser: ${browser}`} onRemove={() => setFilter("browser", "")} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ActivePill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <Badge variant="secondary" className="gap-1 pr-1">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className={cn(
          "rounded-full p-0.5 hover:bg-background/80",
        )}
        aria-label={`Remove ${label} filter`}
      >
        <X className="size-3" />
      </button>
    </Badge>
  );
}
