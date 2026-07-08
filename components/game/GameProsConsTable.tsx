import { ThumbsDown, ThumbsUp } from "lucide-react";

import type { ProsConRow } from "@/lib/game-detail-extras";

export function GameProsConsTable({
  rows,
  productName,
}: {
  rows: ProsConRow[];
  productName: string;
}) {
  if (!rows.length) return null;

  return (
    <section id="pros-cons" className="scroll-mt-28 space-y-4">
      <h2 className="font-heading text-2xl font-bold text-foreground">
        Pros &amp; cons — {productName}
      </h2>
      <div className="mdx-table-wrap not-prose overflow-x-auto rounded-xl border border-border" style={{ WebkitOverflowScrolling: "touch" }}>
        <table className="w-full min-w-[400px] border-collapse text-left text-sm">
          <thead>
            <tr>
              <th className="border-b border-border bg-muted/50 px-4 py-3 font-heading text-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <ThumbsUp className="size-4 text-purple-700 dark:text-purple-400" /> Pros
                </span>
              </th>
              <th className="border-b border-border bg-muted/50 px-4 py-3 font-heading text-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <ThumbsDown className="size-4 text-muted-foreground" /> Cons
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="align-top px-4 py-3 text-muted-foreground">{r.pro}</td>
                <td className="align-top px-4 py-3 text-muted-foreground">{r.con}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
