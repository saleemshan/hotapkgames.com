import { Download, HardDrive, Smartphone, Tag } from "lucide-react";

import { cn } from "@/lib/utils";

const items = (
  meta: {
    size: string;
    version: string;
    requirements: string;
    downloads: string;
  },
) =>
  [
    { icon: HardDrive, label: "Size", value: meta.size },
    { icon: Tag, label: "Version", value: meta.version },
    { icon: Smartphone, label: "Requirements", value: meta.requirements },
    { icon: Download, label: "Downloads", value: meta.downloads },
  ] as const;

export function AppMetaBox({
  className,
  ...meta
}: {
  size: string;
  version: string;
  requirements: string;
  downloads: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-3 rounded-xl border border-border-subtle bg-bg-card/70 p-4 backdrop-blur-md sm:grid-cols-2",
        className,
      )}
    >
      {items(meta).map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex items-start gap-3 rounded-lg bg-bg-deep/40 p-3"
        >
          <Icon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {label}
            </p>
            <p className="font-mono text-sm text-text">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
