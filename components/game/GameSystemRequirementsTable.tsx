import { Cpu } from "lucide-react";

import type { SystemRequirementRow } from "@/lib/game-detail-extras";

export function GameSystemRequirementsTable({
  rows,
  productName,
}: {
  rows: SystemRequirementRow[];
  productName: string;
}) {
  if (!rows.length) return null;

  return (
    <section id="requirements" className="scroll-mt-28 space-y-4">
      <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
        <Cpu className="size-6 text-purple-700 dark:text-purple-400" />
        System requirements — {productName}
      </h2>
      <div className="mdx-table-wrap not-prose overflow-x-auto rounded-xl border border-border" style={{ WebkitOverflowScrolling: "touch" }}>
        <table className="w-full min-w-[320px] border-collapse text-left text-sm">
          <thead>
            <tr>
              <th className="border-b border-border bg-muted/50 px-4 py-3 font-heading text-foreground">
                Requirement
              </th>
              <th className="border-b border-border bg-muted/50 px-4 py-3 font-heading text-foreground">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-border last:border-0">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                  {r.label}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
