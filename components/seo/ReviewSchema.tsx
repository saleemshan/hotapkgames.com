import { JsonLd } from "./JsonLd";
import { absoluteUrl } from "@/lib/seo";
import type { UserReview } from "@/components/game/UserReviews";

interface ReviewSchemaProps {
  name: string;
  /** Public path, e.g. `/pk8-game` or `/guides/my-guide`. */
  urlPath: string;
  reviews: UserReview[];
  overallRating: number;
  totalVotes: number;
}

export function ReviewSchema({
  name,
  urlPath,
  reviews,
  overallRating,
  totalVotes,
}: ReviewSchemaProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        url: absoluteUrl(urlPath),
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: overallRating,
          reviewCount: totalVotes,
          bestRating: "5",
          worstRating: "1",
        },
        review: reviews.slice(0, 5).map((r) => ({
          "@type": "Review",
          author: {
            "@type": "Person",
            name: r.name,
          },
          datePublished: r.date,
          reviewRating: {
            "@type": "Rating",
            ratingValue: r.rating,
            bestRating: "5",
            worstRating: "1",
          },
          reviewBody: r.comment,
        })),
      }}
    />
  );
}
