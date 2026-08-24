import { Star, ThumbsUp } from "lucide-react";

import { MIN_PUBLIC_AGGREGATE_REVIEWS } from "@/lib/review-display";

export interface UserReview {
  name: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

interface UserReviewsProps {
  reviews: UserReview[];
  gameName?: string;
  /** When set (e.g. on guides), used as the section `<h2>` instead of the gameName pattern. */
  heading?: string;
}

export function UserReviews({ reviews, gameName, heading }: UserReviewsProps) {
  if (!reviews.length) return null;

  const showAggregate = reviews.length >= MIN_PUBLIC_AGGREGATE_REVIEWS;
  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: Math.round(
      (reviews.filter((r) => r.rating === star).length / reviews.length) * 100,
    ),
  }));

  const sectionHeading =
    heading ??
    (gameName
      ? showAggregate
        ? `${gameName} User Reviews`
        : `${gameName} reader notes`
      : showAggregate
        ? "User Reviews"
        : "Reader notes");

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-6 font-heading text-xl font-bold">{sectionHeading}</h2>

      {showAggregate ? (
        <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-700 dark:text-purple-400 sm:text-5xl">
              {avgRating.toFixed(1)}
            </div>
            <div className="mt-1 flex justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {reviews.length} reviews
            </p>
          </div>
          <div className="flex-1 space-y-1">
            {distribution.map(({ star, pct }) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-muted-foreground">{star}</span>
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-yellow-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-muted-foreground">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mb-4 text-sm text-muted-foreground">
          Star averages stay hidden until {MIN_PUBLIC_AGGREGATE_REVIEWS} genuine
          reader notes are on file.
        </p>
      )}

      <div className="space-y-4">
        {reviews.map((review, i) => (
          <div key={i} className="min-w-0 rounded-xl border border-border bg-background p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-700/10 dark:bg-purple-400/10 text-xs font-bold text-purple-700 dark:text-purple-400">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.city} • {review.date}</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`h-3 w-3 ${j < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                  />
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <ThumbsUp className="h-3 w-3" />
              {review.helpful} found this helpful
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
