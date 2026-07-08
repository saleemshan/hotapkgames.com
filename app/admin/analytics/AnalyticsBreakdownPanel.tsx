"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BreakdownItem } from "@/lib/analytics/admin-insights";

import { AnalyticsBarList, type BarListItem } from "./AnalyticsBarList";

type AnalyticsBreakdownPanelProps = {
  devices: BreakdownItem[];
  browsers: BreakdownItem[];
  regions: BreakdownItem[];
};

function toBarItems(items: BreakdownItem[]): BarListItem[] {
  return items.map((item) => ({
    id: item.label,
    label: item.label,
    count: item.count,
    pct: item.pct,
  }));
}

export function AnalyticsBreakdownPanel({ devices, browsers, regions }: AnalyticsBreakdownPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pushFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get(key);
      if (current === value) params.delete(key);
      else params.set(key, value);
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <Tabs defaultValue="device">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="device">Device</TabsTrigger>
        <TabsTrigger value="browser">Browser</TabsTrigger>
        <TabsTrigger value="region">Region</TabsTrigger>
      </TabsList>
      <TabsContent value="device" className="mt-4">
        <p className="mb-3 text-xs text-muted-foreground">Click a bar to filter the event log.</p>
        <AnalyticsBarList
          items={toBarItems(devices)}
          emptyMessage="No device data yet."
          onItemClick={(item) => pushFilter("deviceType", item.label)}
        />
      </TabsContent>
      <TabsContent value="browser" className="mt-4">
        <p className="mb-3 text-xs text-muted-foreground">Click a bar to filter the event log.</p>
        <AnalyticsBarList
          items={toBarItems(browsers)}
          emptyMessage="No browser data yet."
          onItemClick={(item) => pushFilter("browser", item.label)}
        />
      </TabsContent>
      <TabsContent value="region" className="mt-4">
        <p className="mb-3 text-xs text-muted-foreground">Click a bar to filter the event log.</p>
        <AnalyticsBarList
          items={toBarItems(regions)}
          emptyMessage="No region data yet."
          onItemClick={(item) => pushFilter("region", item.label)}
        />
      </TabsContent>
    </Tabs>
  );
}
