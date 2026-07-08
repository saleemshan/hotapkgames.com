import { GameCard } from "./GameCard";
import type { Game } from "@/lib/games";

interface GameGridProps {
  games: Game[];
  columns?: 2 | 3 | 4;
}

export function GameGrid({ games, columns = 3 }: GameGridProps) {
  const gridCols =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 4
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid gap-4 ${gridCols}`}>
      {games.map((game) => (
        <GameCard key={game.slug} game={game} />
      ))}
    </div>
  );
}
