import { getAllApps, getAllGames, getAllGuides } from "@/lib/content";

export function HomeDirectoryStats() {
  const games = getAllGames().length;
  const apps = getAllApps().length;
  const guides = getAllGuides().length;

  const stats = [
    { label: "Games listed", value: games },
    { label: "Utility apps", value: apps },
    { label: "Guides", value: guides },
  ] as const;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-border-subtle bg-bg-card/50 px-4 py-3 text-center backdrop-blur-sm"
        >
          <p className="font-display text-2xl font-bold tabular-nums text-accent">
            {s.value}
          </p>
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}
