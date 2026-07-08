import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}) {
  const { category, page } = await params;
  if (!VALID_CATEGORIES.includes(category as Category))
    return { title: "Not Found" };
  return generateCategoryMetadata(category, Number(page));
}

export default async function PaginatedCategoryPage({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}) {
  const { category, page: pageStr } = await params;
  const page = Number(pageStr);

  if (!VALID_CATEGORIES.includes(category as Category) || isNaN(page) || page < 2) {
    notFound();
  }

  const { games, total } = await getGamesByCategory(
    category as Category,
    page,
    ITEMS_PER_PAGE,
  );
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  if (page > totalPages) notFound();

  const label = getCategoryLabel(category);
  const prevHref =
    page === 2
      ? `/category/${category}`
      : `/category/${category}/page/${page - 1}`;
  const nextHref =
    page < totalPages ? `/category/${category}/page/${page + 1}` : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { name: label, href: `/category/${category}` },
          { name: `Page ${page}`, href: `/category/${category}/page/${page}` },
        ]}
      />

      <h1 className="mb-8 font-heading text-3xl font-bold">
        {label} — Page {page}
      </h1>

      {games.length > 0 ? (
        <GameGrid games={games} />
      ) : (
        <p className="py-12 text-center text-muted-foreground">
          No more apps on this page.
        </p>
      )}

      <div className="mt-8 flex justify-center gap-4">
        <Link href={prevHref}>
          <Button variant="outline" className="border-border">
            <ArrowLeft className="mr-1 h-4 w-4" /> Previous
          </Button>
        </Link>
        {nextHref ? (
          <Link href={nextHref}>
            <Button variant="outline" className="border-border">
              Next <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        ) : null}
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
    </div>
  );
}
