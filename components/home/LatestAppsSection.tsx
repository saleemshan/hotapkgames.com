import { LatestAppsLoadMore } from "@/components/home/LatestAppsLoadMore";
import { appToCardModel } from "@/lib/card-mappers";
import { getAllApps } from "@/lib/content";

export function LatestAppsSection() {
  const cards = getAllApps().map(appToCardModel);
  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl font-bold text-text">Latest apps</h2>
      <LatestAppsLoadMore items={cards} />
    </section>
  );
}
