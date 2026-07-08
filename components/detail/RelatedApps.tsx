import { AppCard, type AppCardModel } from "@/components/listing/AppCard";

export function RelatedApps({ items }: { items: AppCardModel[] }) {
  if (!items.length) return null;
  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl font-bold text-text">Related</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((item, i) => (
          <AppCard key={item.href} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
