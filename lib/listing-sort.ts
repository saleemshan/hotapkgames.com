import type { SortValue } from "@/components/listing/SortDropdown";

type Sortable = {
  publishedAt: string;
  views: number;
  rating: number;
  votes: number;
};

export function sortProducts<T extends Sortable>(
  items: T[],
  sort: SortValue,
): T[] {
  const next = [...items];
  switch (sort) {
    case "views":
      return next.sort((a, b) => b.views - a.views);
    case "rating":
      return next.sort(
        (a, b) => b.rating - a.rating || b.votes - a.votes,
      );
    default:
      return next.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime(),
      );
  }
}
