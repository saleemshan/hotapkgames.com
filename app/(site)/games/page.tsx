import type { Metadata } from "next";

import { FilterBar } from "@/components/listing/FilterBar";
import { AppGrid } from "@/components/listing/AppGrid";
import { Pagination } from "@/components/listing/Pagination";
import { SortDropdown } from "@/components/listing/SortDropdown";
import { ListingSidebar } from "@/components/layout/ListingSidebar";
import { AppsListingSearch } from "@/components/search/AppsListingSearch";
import { JsonLd } from "@/components/seo/JsonLd";
import { gameToCardModel } from "@/lib/card-mappers";
import { getAllGames, getAllSearchableItems } from "@/lib/content";
import { LISTINGS_PER_PAGE } from "@/lib/constants";
import type { SortValue } from "@/components/listing/SortDropdown";
import { sortProducts } from "@/lib/listing-sort";
import {
  absoluteUrl,
  buildListingSearchPath,
  getSiteUrl,
  siteConfig,
} from "@/lib/seo";

export const revalidate = 3600;

const GAME_CATS = [
  "casino-games",
  "color-prediction",
  "sports-betting",
  "card-games",
] as const;

const GAME_LABELS: Record<(typeof GAME_CATS)[number], string> = {
  "casino-games": "Casino",
  "color-prediction": "Color prediction",
  "sports-betting": "Sports betting",
  "card-games": "Card games",
};

function parsePage(v: string | string[] | undefined): number {
  const raw = typeof v === "string" ? v : v?.[0];
  const n = raw ? parseInt(raw, 10) : 1;
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const cat =
    typeof sp.category === "string" &&
    GAME_CATS.includes(sp.category as (typeof GAME_CATS)[number])
      ? sp.category
      : undefined;
  const sort = (typeof sp.sort === "string" ? sp.sort : "latest") as SortValue;
  // SEO FIX: Explicit self-canonical for every facet + page (never inherit root "/").
  const path = buildListingSearchPath("/games", { category: cat, sort, page });
  const canonical = absoluteUrl(path);
  const gameCount = getAllGames().length;
  const title =
    page > 1
      ? `Casino & earning games Pakistan – Page ${page}`
      : cat
        ? `${GAME_LABELS[cat as (typeof GAME_CATS)[number]]} casino & earning games Pakistan – APKs 2026`
        : "Casino & real earning games in Pakistan – download & play 2026";
  const description = `Browse ${gameCount}+ reviewed casino, colour prediction, and card-room APKs for Pakistan—filters, sort, and self-canonical listings.`;
  return {
    title,
    description,
    alternates: { canonical },
    robots: page > 1 ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { title, description, url: canonical },
  };
}

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const cat =
    typeof sp.category === "string" &&
    GAME_CATS.includes(sp.category as (typeof GAME_CATS)[number])
      ? sp.category
      : undefined;
  const sort = (typeof sp.sort === "string" ? sp.sort : "latest") as SortValue;

  let list = getAllGames();
  if (cat) list = list.filter((g) => g.category === cat);
  list = sortProducts(list, sort);

  const totalPages = Math.max(1, Math.ceil(list.length / LISTINGS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const slice = list.slice(
    (safePage - 1) * LISTINGS_PER_PAGE,
    safePage * LISTINGS_PER_PAGE,
  );
  const cards = slice.map(gameToCardModel);

  const base = "/games";
  const extra = {
    ...(cat ? { category: cat } : {}),
    ...(sort !== "latest" ? { sort } : {}),
  };

  const q = (parts: Record<string, string | undefined>) => {
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries(parts)) {
      if (v) u.set(k, v);
    }
    const s = u.toString();
    return s ? `?${s}` : "";
  };

  const chips = [
    {
      label: "All",
      href: base + q({ sort: sort !== "latest" ? sort : undefined }),
      active: !cat,
    },
    ...GAME_CATS.map((c) => ({
      label: GAME_LABELS[c],
      href: base + q({ category: c, sort: sort !== "latest" ? sort : undefined }),
      active: cat === c,
    })),
  ];

  const searchItems = getAllSearchableItems().filter((i) => i.kind === "game");

  const listingPath = buildListingSearchPath("/games", {
    category: cat,
    sort,
    page: safePage,
  });
  const listingUrl = absoluteUrl(listingPath);
  const startIndex = (safePage - 1) * LISTINGS_PER_PAGE;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${listingUrl}#collection`,
    url: listingUrl,
    name: "Casino & real earning games in Pakistan – download & play 2026",
    isPartOf: {
      "@type": "WebSite",
      url: getSiteUrl(),
      name: siteConfig.name,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: list.length,
      itemListElement: slice.map((g, i) => ({
        "@type": "ListItem",
        position: startIndex + i + 1,
        url: absoluteUrl(g.url),
        name: g.title,
      })),
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
        <div className="space-y-8">
          <JsonLd data={collectionJsonLd} />
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Casino &amp; real earning games in Pakistan – download &amp; play 2026
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Sub-categories for casino, colour prediction, sports, and card titles—sorted for SEO with
            paginated URLs.
          </p>
        </div>
        <AppsListingSearch items={searchItems} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <FilterBar title="Category" chips={chips} />
          <SortDropdown basePath={base} />
        </div>
        <AppGrid items={cards} />
        <Pagination
          pathname={base}
          page={safePage}
          totalPages={totalPages}
          extraParams={extra}
        />
        </div>
        <ListingSidebar />
      </div>
    </div>
  );
}
