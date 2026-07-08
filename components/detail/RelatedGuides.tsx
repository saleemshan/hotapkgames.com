import Link from "next/link";

import type { Guide } from "contentlayer/generated";

export function RelatedGuides({ guides }: { guides: Guide[] }) {
  if (!guides.length) return null;
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-bold text-text">
        Related guides
      </h2>
      <p className="text-sm text-text-muted">
        Safety, APK installs, and wallet flows for Pakistani players.
      </p>
      <ul className="space-y-2">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link href={g.url} className="text-accent hover:underline">
              {g.title}
            </Link>
            <span className="text-text-muted"> — {g.excerpt}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
