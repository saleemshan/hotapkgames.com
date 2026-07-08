import Fuse from "fuse.js";

import { type SearchableItem, getAllSearchableItems } from "@/lib/content";

let fuseInstance: Fuse<SearchableItem> | null = null;

export function getSearchFuse(): Fuse<SearchableItem> {
  if (!fuseInstance) {
    fuseInstance = new Fuse(getAllSearchableItems(), {
      keys: [
        { name: "title", weight: 0.45 },
        { name: "shortDescription", weight: 0.25 },
        { name: "tags", weight: 0.2 },
        { name: "slug", weight: 0.1 },
      ],
      threshold: 0.32,
      ignoreLocation: true,
    });
  }
  return fuseInstance;
}

export function searchItems(query: string, limit = 40): SearchableItem[] {
  const q = query.trim();
  if (!q) return [];
  return getSearchFuse()
    .search(q, { limit })
    .map((r) => r.item);
}
