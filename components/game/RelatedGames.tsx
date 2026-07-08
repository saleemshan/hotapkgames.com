import { GameCard } from "./GameCard";
import type { Game } from "@/lib/games";

interface RelatedGamesProps {
  games: Game[];
}

export function RelatedGames({ games }: RelatedGamesProps) {
  if (games.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-6 font-heading text-2xl font-bold">Related Games</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>
    </section>
  );
}
