import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SearchResults } from "@/components/search/SearchResults";
import {
  getItemsByTagSlug,
  getTagSlugMap,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  return Array.from(getTagSlugMap().keys()).map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const map = getTagSlugMap();
  const name = map.get(tag);
  if (!name) return { title: "Tag" };
  const items = getItemsByTagSlug(tag);
  const title = `Tagged: ${name} – apps, games & guides`;
  const canonical = absoluteUrl(`/tags/${tag}`);
  const description = `Listings tagged “${name}” for Pakistani players browsing APKs and guides.`;
  return {
    title,
    description,
    alternates: { canonical },
    robots:
      items.length < 3
        ? { index: false, follow: true }
        : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const map = getTagSlugMap();
  const name = map.get(tag);
  if (!name) notFound();

  const items = getItemsByTagSlug(tag);
  if (!items.length) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-text md:text-4xl">
          Tagged: {name}
        </h1>
        <p className="mt-2 text-text-muted">
          {items.length} entr{items.length === 1 ? "y" : "ies"} across apps, games, and guides.
        </p>
      </div>
      <SearchResults items={items} />
    </div>
  );
}
