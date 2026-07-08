import Image from "next/image";
import { RatingStars } from "./RatingStars";
import { VersionBadge } from "./VersionBadge";
import { DownloadButton } from "./DownloadButton";
import { ShareButtons } from "./ShareButtons";
import { Download, HardDrive, Smartphone } from "lucide-react";
import type { Game } from "@/lib/games";
import { BASE_URL } from "@/lib/seo";

interface GameHeroProps {
  game: Game;
}

export function GameHero({ game }: GameHeroProps) {
  const shareUrl = `${BASE_URL}/${game.slug}`;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-6">
        <div className="relative mx-auto h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-muted md:mx-0 md:h-32 md:w-32">
          {game.iconUrl ? (
            <Image
              src={game.iconUrl}
              alt={`${game.title} APK download icon`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 96px, 128px"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center gradient-primary text-4xl font-bold text-white">
              {game.title.charAt(0)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <h1 className="font-heading text-xl font-bold leading-tight text-balance sm:text-2xl md:text-3xl wrap-break-word">
              {game.title}
            </h1>
            <VersionBadge
              isNew={game.isNew}
              isUpdated={game.isUpdated}
              isFeatured={game.isFeatured}
            />
          </div>

          <div className="flex justify-center md:justify-start">
            <RatingStars
              rating={Number(game.rating) || 0}
              votes={game.totalVotes || 0}
              size="md"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground md:justify-start">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
              {(game.downloadCount || 0).toLocaleString()} downloads
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <HardDrive className="h-4 w-4 shrink-0" aria-hidden="true" />
              {game.fileSize}
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Smartphone className="h-4 w-4 shrink-0" aria-hidden="true" />
              {game.osRequirements}
            </span>
          </div>

          {game.version && (
            <p className="text-sm text-muted-foreground">
              Version:{" "}
              <span className="font-mono text-purple-700 dark:text-purple-300">
                {game.version}
              </span>
            </p>
          )}

          <div className="flex justify-center pt-2 md:justify-start">
            <ShareButtons url={shareUrl} title={game.seoTitle || game.title} />
          </div>

          {game.downloadUrl ? (
            <div className="flex justify-center pt-2 md:hidden">
              <a
                href={game.downloadUrl}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="flex w-full min-h-[48px] max-w-sm items-center justify-center gap-2 rounded-xl gradient-primary px-4 text-base font-heading font-bold text-white shadow-lg shadow-primary/25"
              >
                <Download className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="truncate">Download APK</span>
              </a>
            </div>
          ) : null}
        </div>

        <div className="hidden w-full md:block md:w-56 md:shrink-0">
          {game.downloadUrl && (
            <DownloadButton url={game.downloadUrl} gameName={game.title} />
          )}
        </div>
      </div>
    </div>
  );
}
