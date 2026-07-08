import Link from "next/link";

import { AppGrid } from "@/components/listing/AppGrid";
import { Pagination } from "@/components/listing/Pagination";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { gameToCardModel } from "@/lib/card-mappers";
import { HOMEPAGE_GAMES_PER_PAGE } from "@/lib/constants";
import { getHomepageGamesPage } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export function HomeFeaturedGamesSection({ page }: { page: number }) {
  const {
    games,
    page: currentPage,
    totalPages,
    startIndex,
    total,
  } = getHomepageGamesPage(page, HOMEPAGE_GAMES_PER_PAGE);
  const cards = games.map(gameToCardModel);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: total,
    itemListElement: games.map((g, i) => ({
      "@type": "ListItem",
      position: startIndex + i + 1,
      url: absoluteUrl(g.url),
      name: g.title,
    })),
  };

  return (
    <section
      className="rounded-3xl border border-border-subtle bg-bg-card/30 px-5 py-10 backdrop-blur-md sm:px-8 md:py-12"
      aria-labelledby="home-games-heading"
      id="home-games"
    >
      <JsonLd data={itemList} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl space-y-2">
          <h2
            id="home-games-heading"
            className="font-display text-2xl font-bold tracking-tight text-text md:text-3xl"
          >
            Top earning &amp; casino games in Pakistan
          </h2>
          <p className="text-pretty text-sm leading-relaxed text-text-muted md:text-base">
            Each card shows downloads, size, and version from our listing metadata—tap{" "}
            <strong className="font-medium text-text">Review</strong> for the full write-up or{" "}
            <strong className="font-medium text-text">Download</strong> to jump straight to
            mirrors.
          </p>
          {total > 0 ? (
            <p className="text-xs text-text-muted">
              Showing{" "}
              <span className="tabular-nums text-text/90">
                {startIndex + 1}–{startIndex + games.length}
              </span>{" "}
              of <span className="tabular-nums text-text/90">{total}</span> games
              {totalPages > 1 ? (
                <>
                  {" "}
                  · page{" "}
                  <span className="tabular-nums text-text/90">{currentPage}</span> of{" "}
                  <span className="tabular-nums text-text/90">{totalPages}</span>
                </>
              ) : null}
            </p>
          ) : null}
        </div>
        <Link
          href="/games"
          className={cn(buttonVariants({ variant: "outline", size: "default" }), "font-heading")}
        >
          View all games
        </Link>
      </div>
      <div className="mt-8">
        {cards.length ? (
          <AppGrid items={cards} />
        ) : (
          <p className="rounded-xl border border-border-subtle bg-bg-deep/40 p-6 text-sm text-text-muted">
            No games published yet. Check back soon.
          </p>
        )}
      </div>
      <Pagination
        pathname="/"
        page={currentPage}
        totalPages={totalPages}
        scrollAnchor="home-games"
        className="pt-6"
      />
    </section>
  );
}
