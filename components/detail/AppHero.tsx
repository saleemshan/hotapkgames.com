import Image from "next/image";

import { DownloadButton } from "@/components/detail/DownloadButton";
import { NewBadge } from "@/components/ui/NewBadge";
import { StarRating } from "@/components/listing/StarRating";
import { cn } from "@/lib/utils";

function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border-subtle bg-bg-deep/50 px-3 py-1 text-xs font-medium text-text-muted">
      {children}
    </span>
  );
}

export function AppHero({
  title,
  coverImage,
  shortDescription,
  rating,
  votes,
  downloadHref,
  downloads,
  size,
  requirements,
  version,
  isNew,
}: {
  title: string;
  coverImage: string;
  shortDescription: string;
  rating: number;
  votes: number;
  /** First HTTPS mirror — hero button links here when present. */
  downloadHref?: string | null;
  downloads?: string;
  size?: string;
  requirements?: string;
  version?: string;
  isNew?: boolean;
}) {
  const showPills =
    Boolean(downloads) || Boolean(size) || Boolean(requirements) || Boolean(version);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border-subtle bg-gradient-to-br from-bg-card/90 via-bg-card/50 to-bg-deep/60 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-md md:p-8",
      )}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div className="relative mx-auto size-[120px] shrink-0 overflow-hidden rounded-2xl border border-border-subtle bg-bg-deep shadow-lg ring-1 ring-accent/10 sm:size-[140px] lg:mx-0">
          <Image
            src={coverImage}
            alt={title}
            width={140}
            height={140}
            priority
            fetchPriority="high"
            className="size-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1 space-y-4 text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            {isNew ? <NewBadge pinned={false} /> : null}
            <span className="rounded-full border border-border-subtle bg-accent-dim/40 px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-accent">
              APK listing
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-text md:text-4xl lg:text-[2.35rem] lg:leading-tight">
            {title}
          </h1>
          <StarRating
            rating={rating}
            votes={votes}
            className="justify-center lg:justify-start"
          />
          {showPills ? (
            <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
              {downloads ? <MetaPill>{downloads} downloads</MetaPill> : null}
              {size ? <MetaPill>{size}</MetaPill> : null}
              {requirements ? <MetaPill>{requirements}</MetaPill> : null}
              {version ? <MetaPill>{version}</MetaPill> : null}
            </div>
          ) : null}
          <p className="text-pretty text-base leading-relaxed text-text-muted md:text-lg">
            {shortDescription}
          </p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
            <DownloadButton href={downloadHref} />
            {downloadHref ? (
              <a
                href="#download"
                className="text-sm font-medium text-accent underline-offset-2 hover:underline"
              >
                More mirrors &amp; file checks
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
