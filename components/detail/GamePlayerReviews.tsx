import Link from "next/link";

import { getContactEmail } from "@/lib/seo";

import { StarRating } from "@/components/listing/StarRating";

export type PlayerReview = {
  name: string;
  place?: string;
  rating: number;
  text: string;
};

export function GamePlayerReviews({
  gameTitle,
  reviews,
}: {
  gameTitle: string;
  reviews: PlayerReview[];
}) {
  const email = getContactEmail();

  return (
    <section
      className="space-y-4"
      aria-labelledby="player-reviews-heading"
    >
      <div className="space-y-1">
        <h2
          id="player-reviews-heading"
          className="font-display text-xl font-bold text-text"
        >
          Player reviews
        </h2>
        <p className="text-sm text-text-muted">
          Short notes from readers about {gameTitle}. These are{" "}
          <span className="font-medium text-text">community-style submissions</span>{" "}
          we edit for clarity—not publisher support or guaranteed facts.
        </p>
      </div>

      {reviews.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {reviews.map((r, i) => (
            <li
              key={`${r.name}-${i}`}
              className="flex flex-col rounded-xl border border-border-subtle bg-bg-card/50 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-text">{r.name}</p>
                <StarRating
                  rating={r.rating}
                  votes={0}
                  hideVotes
                  className="scale-90"
                />
              </div>
              {r.place ? (
                <p className="text-xs text-text-muted">{r.place}</p>
              ) : null}
              <blockquote className="mt-2 border-l-2 border-accent/40 pl-3 text-sm text-text-muted">
                <p className="text-pretty text-text/90">&ldquo;{r.text}&rdquo;</p>
              </blockquote>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-border-subtle bg-bg-card/40 p-4 text-sm text-text-muted">
          <p>
            We don&apos;t have published reader write-ups for this listing yet. If you&apos;d
            like to suggest a correction or share structured feedback about{" "}
            <span className="font-medium text-text">{gameTitle}</span>, email{" "}
            <a href={`mailto:${email}`} className="text-accent hover:underline">
              {email}
            </a>{" "}
            with the game name in the subject line.
          </p>
          <p className="mt-2">
            <Link href="/about#editorial-team" className="text-accent hover:underline">
              Meet the editorial team
            </Link>{" "}
            that maintains listings and guides.
          </p>
        </div>
      )}
    </section>
  );
}
