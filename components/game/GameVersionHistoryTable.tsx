import { History } from "lucide-react";

import type { VersionHistoryRow } from "@/lib/game-detail-extras";

export function GameVersionHistoryTable({
  rows,
  productName,
}: {
  rows: VersionHistoryRow[];
  productName: string;
}) {
  if (!rows.length) return null;

  return (
    <section id="version-history" className="scroll-mt-28 space-y-4">
      <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
        <History className="size-6 text-primary" />
        APK version history — {productName}
      </h2>
      <p className="max-w-2xl text-sm text-muted-foreground">
        Build labels and release dates for Pakistani mirror APKs; verify checksum after
        download when possible.
      </p>
      <div className="mdx-table-wrap not-prose overflow-x-auto rounded-xl border border-border" style={{ WebkitOverflowScrolling: "touch" }}>
        <table className="w-full min-w-[500px] border-collapse text-left text-sm">
          <thead>
            <tr>
              <th className="border-b border-border bg-muted/50 px-4 py-3 font-heading text-foreground">
                Version
              </th>
              <th className="border-b border-border bg-muted/50 px-4 py-3 font-heading text-foreground">
                Released
              </th>
              <th className="border-b border-border bg-muted/50 px-4 py-3 font-heading text-foreground">
                Size
              </th>
              <th className="border-b border-border bg-muted/50 px-4 py-3 font-heading text-foreground">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.version}-${i}`} className="border-b border-border last:border-0">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-purple-700 dark:text-purple-300">
                  {r.version}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {r.released}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {r.size ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{r.notes ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
