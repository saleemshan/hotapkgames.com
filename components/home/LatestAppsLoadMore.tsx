"use client";

import { useMemo, useState } from "react";

import { AppCard, type AppCardModel } from "@/components/listing/AppCard";
import { Button } from "@/components/ui/button";

const PAGE = 12;

export function LatestAppsLoadMore({ items }: { items: AppCardModel[] }) {
  const [n, setN] = useState(PAGE);
  const visible = useMemo(() => items.slice(0, n), [items, n]);
  const more = n < items.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item, i) => (
          <AppCard key={item.href} item={item} index={i} />
        ))}
      </div>
      {more ? (
        <div className="flex justify-center">
          <Button variant="outline" type="button" onClick={() => setN((x) => x + PAGE)}>
            Load more
          </Button>
        </div>
      ) : null}
    </div>
  );
}
