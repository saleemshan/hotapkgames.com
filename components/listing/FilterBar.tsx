import Link from "next/link";

import { cn } from "@/lib/utils";

type Chip = { label: string; href: string; active?: boolean };

export function FilterBar({
  title,
  chips,
  className,
}: {
  title?: string;
  chips: Chip[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {title ? (
        <p className="text-sm font-medium text-text-muted">{title}</p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition",
              c.active
                ? "border-accent bg-accent-dim text-accent"
                : "border-border-subtle text-text-muted hover:border-accent/30 hover:text-text",
            )}
          >
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
