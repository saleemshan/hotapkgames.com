import { cn } from "@/lib/utils";

export function AppCardSkeleton({
  className,
  compact,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "skeleton-shimmer overflow-hidden rounded-xl border border-border-subtle bg-bg-card/40",
        compact ? "flex gap-3 p-3" : "flex flex-col",
        className,
      )}
    >
      <div
        className={cn(
          "bg-text-muted/10",
          compact ? "size-[75px] shrink-0 rounded-lg" : "aspect-[16/10] w-full",
        )}
      />
      <div className={cn("flex flex-1 flex-col gap-2", !compact && "p-4")}>
        <div className="h-3 w-24 rounded bg-text-muted/15" />
        <div className="h-4 w-full max-w-[90%] rounded bg-text-muted/15" />
        <div className="h-4 w-2/3 rounded bg-text-muted/10" />
      </div>
    </div>
  );
}
