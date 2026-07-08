/** Display-only aggregate for merged `UserReview` lists (no I/O). */
export function averageReviewRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}
