import { AppCard, type AppCardModel } from "@/components/listing/AppCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { appToCardModel } from "@/lib/card-mappers";
import { getTopRatedApps } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export function TopRatedSection() {
  const apps = getTopRatedApps(6);
  const cards: AppCardModel[] = apps.map(appToCardModel);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: apps.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(a.url),
      name: a.title,
    })),
  };

  return (
    <section className="space-y-4">
      <JsonLd data={itemList} />
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-text">
          Top rated apps
        </h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cards.map((item, i) => (
          <div key={item.href} className="w-[280px] shrink-0">
            <AppCard item={item} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
