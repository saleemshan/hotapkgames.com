import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { getAllGuides } from "@/lib/content";
import { formatPkDate } from "@/lib/utils";

export function GeneralGuidesSection() {
  const guides = getAllGuides().slice(0, 6);
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Guides &amp; long-form reviews
        </h2>
        <Link
          href="/guides"
          className="text-sm font-medium text-accent hover:underline"
        >
          View all guides
        </Link>
      </div>
      <ul className="grid gap-5 lg:grid-cols-2">
        {guides.map((g) => (
          <li
            key={g.slug}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card/60 p-4 shadow-lg backdrop-blur-sm transition hover:border-accent/35 sm:flex-row"
          >
            <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg sm:aspect-[16/10] sm:w-48">
              <Image
                src={g.coverImage}
                alt={`Cover image for the guide “${g.title}”`}
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <Badge variant="secondary">{g.category}</Badge>
              <Link href={g.url}>
                <h3 className="font-heading text-lg font-semibold text-foreground hover:text-accent">
                  {g.title}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground">{g.excerpt}</p>
              <p className="text-xs text-muted-foreground">
                {formatPkDate(g.publishedAt)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
