import type { Metadata } from "next";

import { SearchPageClient } from "@/components/search/SearchPageClient";
import { getAllSearchableItems } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/seo";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const title = q ? `Search: "${q}"` : "Search";
  return {
    title,
    description: "Search apps, games, and guides.",
    alternates: { canonical: absoluteUrl("/search") },
    robots: { index: false, follow: true },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      url: absoluteUrl("/search"),
    },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const initialQ =
    typeof sp.q === "string" ? sp.q.trim() : "";
  const items = getAllSearchableItems();
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Search</h1>
        <p className="mt-2 text-muted-foreground">
          Fuzzy search across apps, games, and guides.
        </p>
      </div>
      <SearchPageClient items={items} initialQuery={initialQ} />
    </div>
  );
}
