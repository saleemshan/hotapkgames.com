import { JsonLd } from "./JsonLd";
import { BASE_URL } from "@/lib/seo";
import type { Game } from "@/lib/games";

interface GameSchemaProps {
  game: Game;
}

export function GameSchema({ game }: GameSchemaProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: game.title,
        applicationCategory: "GameApplication",
        operatingSystem: game.osRequirements || "Android, iOS",
        url: `${BASE_URL}/${game.slug}`,
        image: game.iconUrl
          ? game.iconUrl.startsWith("http") ? game.iconUrl : `${BASE_URL}${game.iconUrl}`
          : undefined,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "PKR",
        },
        aggregateRating: game.rating
          ? {
              "@type": "AggregateRating",
              ratingValue: game.rating,
              ratingCount: game.totalVotes || 1,
              bestRating: "5",
              worstRating: "1",
            }
          : undefined,
        softwareVersion: game.version || undefined,
        fileSize: game.fileSize || undefined,
        datePublished: game.publishedAt?.toISOString(),
        dateModified: game.updatedAt?.toISOString(),
      }}
    />
  );
}
