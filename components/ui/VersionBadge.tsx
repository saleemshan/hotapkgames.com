import { cn } from "@/lib/utils";

export function VersionBadge({
  version,
  className,
}: {
  version: string;
  className?: string;
}) {
  const normalized = /^v/i.test(version.trim()) ? version.trim() : `v${version.trim()}`;
  return (
    <span
      className={cn(
        "rounded-md border border-border-subtle bg-bg-deep/50 px-2 py-0.5 font-mono text-[11px] font-medium text-text/90 tabular-nums",
        className,
      )}
    >
      {normalized}
    </span>
  );
}
