import { AppCard, type AppCardModel } from "@/components/listing/AppCard";

export function AppGrid({
  items,
  compactFirstRow = false,
}: {
  items: AppCardModel[];
  compactFirstRow?: boolean;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item, i) => (
        <AppCard
          key={item.href}
          item={item}
          index={i}
          compact={compactFirstRow && i < 3}
        />
      ))}
    </div>
  );
}
