import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { GameGrid } from "@/components/game/GameGrid";
import { Button } from "@/components/ui/button";
import { getGamesByCategory } from "@/lib/games";
import { generateCategoryMetadata, getCategoryLabel } from "@/lib/seo";

const VALID_CATEGORIES = [
  "casino-games",
  "color-prediction",
  "card-games",
  "sports-betting",
] as const;
type Category = (typeof VALID_CATEGORIES)[number];
const ITEMS_PER_PAGE = 12;

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "casino-games":
    "Verified casino game APKs for Pakistani players—slots, Teen Patti, and live-style tables with JazzCash and EasyPaisa notes in each HotAPK Games review.",
  "color-prediction":
    "Colour-prediction and Wingo APKs reviewed for Pakistan: install steps, mirror links, bonus wagering, and withdrawal patterns from our editorial team.",
  "card-games":
    "Card-room and Teen Patti earning APKs with structured download guides, safety checklists, and wallet rail comparisons.",
  "sports-betting":
    "Sports-betting shells inside earning-game APKs—odds tabs, deposit minimums, and cash-out notes for Pakistani Android users.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!VALID_CATEGORIES.includes(category as Category))
    return { title: "Not Found" };
  return generateCategoryMetadata(category);
}

export function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { category } = await params;
  const { sort } = await searchParams;

  if (!VALID_CATEGORIES.includes(category as Category)) notFound();

  const sortBy = (
    sort === "top-rated" || sort === "most-viewed" ? sort : "newest"
  ) as "newest" | "top-rated" | "most-viewed";

  const { games, total } = await getGamesByCategory(
    category as Category,
    1,
    ITEMS_PER_PAGE,
    sortBy,
  );
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const label = getCategoryLabel(category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ name: label, href: `/category/${category}` }]} />

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">{label}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {CATEGORY_DESCRIPTIONS[category]}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            { value: "newest", label: "Newest" },
            { value: "top-rated", label: "Top Rated" },
            { value: "most-viewed", label: "Most Downloaded" },
          ] as const
        ).map((option) => (
          <Link
            key={option.value}
            href={`/category/${category}${option.value !== "newest" ? `?sort=${option.value}` : ""}`}
          >
            <Button
              variant={sortBy === option.value ? "default" : "outline"}
              size="sm"
              className={
                sortBy === option.value
                  ? "gradient-primary text-white"
                  : "border-border text-muted-foreground"
              }
            >
              {option.label}
            </Button>
          </Link>
        ))}
      </div>

      {games.length > 0 ? (
        <GameGrid games={games} />
      ) : (
        <p className="py-12 text-center text-muted-foreground">
          No apps found in this category yet.
        </p>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <Link href={`/category/${category}/page/2`}>
            <Button variant="outline" className="border-border">
              Next Page <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
