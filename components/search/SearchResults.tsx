import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import type { SearchableItem } from "@/lib/content";

const kindLabel: Record<SearchableItem["kind"], string> = {
  app: "App",
  game: "Game",
  guide: "Guide",
};

export function SearchResults({ items }: { items: SearchableItem[] }) {
  if (!items.length) {
    return (
      <p className="rounded-xl border border-border bg-card/60 p-8 text-center text-muted-foreground">
        No results. Try &quot;P999&quot;, &quot;injector&quot;, or &quot;JazzCash&quot;.
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={item.href}
            className="block rounded-xl border border-border bg-card p-4 transition hover:border-primary/35"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{kindLabel[item.kind]}</Badge>
              <span className="text-xs text-muted-foreground">{item.category}</span>
            </div>
            <h2 className="mt-2 font-heading text-lg font-semibold text-foreground">
              {item.title}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {item.shortDescription}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
