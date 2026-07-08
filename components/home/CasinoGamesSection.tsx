import Link from "next/link";

import { AppGrid } from "@/components/listing/AppGrid";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { gameToCardModel } from "@/lib/card-mappers";
import { getFeaturedGamesInCategory } from "@/lib/content";

export function CasinoGamesSection() {
  const games = getFeaturedGamesInCategory("casino-games", 6);
  const cards = games.map(gameToCardModel);
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-text">
          Top casino games in Pakistan 2026
        </h2>
        <Link
          href="/games?category=casino-games"
          className={cn(buttonVariants({ variant: "ghost", size: "default" }), "font-heading")}
        >
          View more
        </Link>
      </div>
      <AppGrid items={cards} />
    </section>
  );
}
