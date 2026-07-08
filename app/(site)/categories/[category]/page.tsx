import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppGrid } from "@/components/listing/AppGrid";
import { Pagination } from "@/components/listing/Pagination";
import { appToCardModel, gameToCardModel } from "@/lib/card-mappers";
import {
  getAllCategorySlugs,
  getAppsByCategory,
  getGamesByCategory,
} from "@/lib/content";
import { categoryHeading, categorySeoParagraph } from "@/lib/category-copy";
import { LISTINGS_PER_PAGE } from "@/lib/constants";
import { absoluteUrl, buildListingSearchPath } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllCategorySlugs().map((category) => ({ category }));
}

function parsePage(v: string | string[] | undefined): number {
  const raw = typeof v === "string" ? v : v?.[0];
  const n = raw ? parseInt(raw, 10) : 1;
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { category } = await params;
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const label = categoryHeading(category);
  // SEO FIX: Paginated category hubs get self-canonicals and noindex on page>1 (matches games/apps).
  const path = buildListingSearchPath(`/categories/${category}`, { page });
  const canonical = absoluteUrl(path);
  const title =
    page > 1
      ? `${label} games & apps in Pakistan – Page ${page}`
      : `${label} games & apps in Pakistan`;
  return {
    title,
    description: categorySeoParagraph(category),
    alternates: { canonical },
    robots: page > 1 ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { title, url: canonical },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { category } = await params;
  const sp = await searchParams;
  const page = parsePage(sp.page);

  const apps = getAppsByCategory(category);
  const games = getGamesByCategory(category);
  const merged = [...games.map(gameToCardModel), ...apps.map(appToCardModel)];

  if (!merged.length) notFound();

  const totalPages = Math.max(1, Math.ceil(merged.length / LISTINGS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const slice = merged.slice(
    (safePage - 1) * LISTINGS_PER_PAGE,
    safePage * LISTINGS_PER_PAGE,
  );

  const label = categoryHeading(category);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-text md:text-4xl">
          {label} games &amp; apps in Pakistan
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-text-muted">
          {categorySeoParagraph(category)}
        </p>
      </div>
      <AppGrid items={slice} />
      <Pagination
        pathname={`/categories/${category}`}
        page={safePage}
        totalPages={totalPages}
      />
    </div>
  );
}
