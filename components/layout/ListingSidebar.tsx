import Link from "next/link";

import { getMostRatedGames, getMostViewedGames } from "@/lib/content";
import { formatPkDate, slugifyTag } from "@/lib/utils";

function MiniList({
  title,
  items,
}: {
  title: string;
  items: { href: string; title: string; meta: string }[];
}) {
  return (
    <div className="rounded-xl border border-border bg-card/80 p-4 backdrop-blur-sm">
      <p className="mb-3 font-heading text-sm font-bold text-foreground">{title}</p>
      <ul className="space-y-3 text-sm">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="font-medium text-foreground hover:text-purple-700 dark:text-purple-400">
              {i.title}
            </Link>
            <p className="text-xs text-muted-foreground">{i.meta}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ListingSidebar() {
  const viewed = getMostViewedGames(5).map((g) => ({
    href: g.url,
    title: g.title,
    meta: `${g.downloads} · ${formatPkDate(g.publishedAt)}`,
  }));
  const rated = getMostRatedGames(5).map((g) => ({
    href: g.url,
    title: g.title,
    meta: `★ ${g.rating.toFixed(1)} · ${g.votes.toLocaleString("en-PK")} votes`,
  }));

  const tagHints = ["P999 Game", "Casino App Pakistan", "APK Download"];

  return (
    <aside className="flex flex-col gap-6">
      <MiniList title="Most viewed games" items={viewed} />
      <MiniList title="Most rated games" items={rated} />
      <div className="rounded-xl border border-border bg-card/80 p-4">
        <p className="mb-3 font-heading text-sm font-bold text-foreground">Popular tags</p>
        <div className="flex flex-wrap gap-2">
          {tagHints.map((t) => (
            <Link
              key={t}
              href={`/tags/${slugifyTag(t)}`}
              className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground hover:border-purple-700 dark:border-purple-400/35"
            >
              {t}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
