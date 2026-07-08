"use client";

import Fuse from "fuse.js";
import { useDeferredValue, useMemo, useState } from "react";

import { SearchResults } from "@/components/search/SearchResults";
import type { SearchableItem } from "@/lib/content";

const fuseOptions: ConstructorParameters<typeof Fuse<SearchableItem>>[1] = {
  keys: [
    { name: "title", weight: 0.45 },
    { name: "shortDescription", weight: 0.25 },
    { name: "tags", weight: 0.2 },
    { name: "slug", weight: 0.1 },
  ],
  threshold: 0.32,
  ignoreLocation: true,
};

export function SearchPageClient({
  items,
  initialQuery = "",
}: {
  items: SearchableItem[];
  /** From server `searchParams` so `/search?q=` from the hero form hydrates without effects. */
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const deferred = useDeferredValue(query);

  const fuse = useMemo(
    () => new Fuse(items, fuseOptions),
    [items],
  );

  const results = useMemo(() => {
    const q = deferred.trim();
    if (!q) return [];
    return fuse.search(q, { limit: 40 }).map((r) => r.item);
  }, [deferred, fuse]);

  return (
    <div className="space-y-6">
      <label className="block">
        <span className="sr-only">Search</span>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search apps, games, guides…"
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </label>
      <SearchResults items={results} />
    </div>
  );
}
