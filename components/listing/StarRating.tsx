import { Star, StarHalf } from "lucide-react";

import { cn } from "@/lib/utils";

function clampRating(r: number): number {
  return Math.min(5, Math.max(0, r));
}

export function StarRating({
  rating,
  votes,
  hideVotes,
  className,
}: {
  rating: number;
  votes: number;
  /** When true, omit aggregate vote label (e.g. single reader quotes). */
  hideVotes?: boolean;
  className?: string;
}) {
  const r = clampRating(rating);
  const full = Math.floor(r);
  const half = r - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <span className="flex text-gold" aria-hidden>
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f-${i}`} className="size-4 fill-current" />
        ))}
        {half === 1 ? (
          <StarHalf className="size-4 fill-current" />
        ) : null}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e-${i}`} className="size-4 text-text-muted/40" />
        ))}
      </span>
      <span className="font-mono text-sm text-text">
        {r.toFixed(1)}
        {hideVotes ? null : (
          <>
            {" "}
            <span className="text-text-muted">
              ({votes.toLocaleString("en-PK")} votes)
            </span>
          </>
        )}
      </span>
    </div>
  );
}
