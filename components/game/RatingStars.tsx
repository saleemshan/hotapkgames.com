import { Star, StarHalf } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  votes?: number;
  size?: "sm" | "md" | "lg";
}

export function RatingStars({ rating, votes, size = "md" }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-6 w-6" : "h-4 w-4";
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-lg" : "text-sm";

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={`${iconSize} fill-yellow-400 text-yellow-400`} />
        ))}
        {hasHalf && <StarHalf className={`${iconSize} fill-yellow-400 text-yellow-400`} />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className={`${iconSize} text-muted-foreground/30`} />
        ))}
      </div>
      <span className={`${textSize} font-semibold text-yellow-400`}>{rating}</span>
      {votes !== undefined && (
        <span className={`${textSize} text-muted-foreground`}>({votes.toLocaleString()})</span>
      )}
    </div>
  );
}
