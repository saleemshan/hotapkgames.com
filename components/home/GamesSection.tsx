import Link from "next/link";

import { AppGrid } from "@/components/listing/AppGrid";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { gameToCardModel } from "@/lib/card-mappers";
import { getAllGames } from "@/lib/content";

export function GamesSection() {
  const games = getAllGames()
    .filter((g) => g.category !== "casino-games")
    .slice(0, 6);
  const cards = games.map(gameToCardModel);
  if (!cards.length) return null;
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-text">
          Earning &amp; prediction games
        </h2>
        <Link
          href="/games"
          className={cn(buttonVariants({ variant: "ghost", size: "default" }), "font-heading")}
        >
          Browse all games
        </Link>
      </div>
      <AppGrid items={cards} />
    </section>
  );
}
