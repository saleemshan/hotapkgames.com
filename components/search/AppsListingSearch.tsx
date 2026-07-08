"use client";

import Fuse from "fuse.js";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";

import type { SearchableItem } from "@/lib/content";

export function AppsListingSearch({
  items,
  placeholder = "Instant search apps…",
}: {
  items: SearchableItem[];
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ["title", "shortDescription", "tags", "slug"],
        threshold: 0.28,
        ignoreLocation: true,
      }),
    [items],
  );

  const hits = useMemo(() => {
    const q = deferred.trim();
    if (!q) return [];
    return fuse.search(q, { limit: 8 }).map((r) => r.item);
  }, [deferred, fuse]);

  return (
    <div className="relative">
      <label className="block">
        <span className="sr-only">Filter apps</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border-subtle bg-bg-card/80 px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
      </label>
      {hits.length > 0 ? (
        <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-border-subtle bg-bg-deep py-1 shadow-xl">
          {hits.map((h) => (
            <li key={h.id}>
              <Link
                href={h.href}
                className="block px-3 py-2 text-sm text-text hover:bg-accent-dim/40"
                onClick={() => setQuery("")}
              >
                {h.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
