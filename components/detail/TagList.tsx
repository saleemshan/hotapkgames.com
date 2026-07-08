import Link from "next/link";

import { slugifyTag } from "@/lib/utils";

export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <Link
          key={t}
          href={`/tags/${slugifyTag(t)}`}
          className="rounded-full border border-border-subtle bg-bg-card/50 px-3 py-1 text-xs text-text-muted transition hover:border-accent/35 hover:text-accent"
        >
          {t}
        </Link>
      ))}
    </div>
  );
}
