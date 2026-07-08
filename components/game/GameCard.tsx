import Link from "next/link";
import Image from "next/image";
import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RatingStars } from "./RatingStars";
import { VersionBadge } from "./VersionBadge";
import { DownloadCardButton } from "./DownloadCardButton";
import type { Game } from "@/lib/games";

interface GameCardProps {
  game: Game;
  compact?: boolean;
}

export function GameCard({ game, compact = false }: GameCardProps) {
  if (compact) {
    return (
      <Link href={`/${game.slug}`}>
        <Card className="group relative overflow-hidden border-border bg-card transition-all duration-300 hover:border-purple-700 dark:border-purple-400/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                {game.iconUrl ? (
                  <Image
                    src={game.iconUrl}
                    alt={`${game.title} APK download icon`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center gradient-primary text-xl font-bold text-white">
                    {game.title.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="truncate font-heading text-sm font-semibold group-hover:text-purple-700 dark:text-purple-400 transition-colors">
                    {game.title}
                  </h3>
                  <VersionBadge
                    isNew={game.isNew}
                    isUpdated={game.isUpdated}
                    isFeatured={game.isFeatured}
                  />
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {game.version} • {game.fileSize}
                </p>
                <div className="mt-1.5">
                  <RatingStars rating={Number(game.rating) || 0} size="sm" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Card className="group relative overflow-hidden border-border bg-card transition-all duration-300 hover:border-purple-700 dark:border-purple-400/40 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="p-4">
        <Link href={`/${game.slug}`} className="flex gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
            {game.iconUrl ? (
              <Image
                src={game.iconUrl}
                alt={`Download ${game.title} APK for Pakistan – free earning game`}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center gradient-primary text-xl font-bold text-white">
                {game.title.charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate font-heading text-sm font-semibold group-hover:text-purple-700 dark:text-purple-400 transition-colors">
                {game.title}
              </h3>
              <VersionBadge
                isNew={game.isNew}
                isUpdated={game.isUpdated}
                isFeatured={game.isFeatured}
              />
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {game.version} • {game.fileSize}
            </p>
            <div className="mt-1">
              <RatingStars rating={Number(game.rating) || 0} size="sm" />
            </div>
          </div>
        </Link>
        {game.description && (
          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
            {game.description}
          </p>
        )}
        <div className="mt-3 flex items-center gap-2">
          {game.downloadUrl ? (
            <DownloadCardButton url={game.downloadUrl} gameName={game.title} />
          ) : (
            <Link
              href={`/${game.slug}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg gradient-primary px-3 py-2 text-xs font-bold text-white hover:scale-[1.02] transition-transform"
            >
              <Download className="h-3.5 w-3.5" />
              Get APK
            </Link>
          )}
          <Link
            href={`/${game.slug}`}
            className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-purple-700 dark:border-purple-400/40 transition-colors"
          >
            Details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
