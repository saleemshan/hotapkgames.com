import { CheckCircle2, XCircle } from "lucide-react";

interface ProsConsProps {
  pros?: string[];
  cons?: string[];
}

export function ProsCons({ pros = [], cons = [] }: ProsConsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 my-6">
      <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5">
        <h4 className="mb-3 flex items-center gap-2 font-heading text-lg font-semibold text-green-400">
          <CheckCircle2 className="h-5 w-5" />
          Pros
        </h4>
        <ul className="space-y-2">
          {pros.map((pro, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
              {pro}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
        <h4 className="mb-3 flex items-center gap-2 font-heading text-lg font-semibold text-red-400">
          <XCircle className="h-5 w-5" />
          Cons
        </h4>
        <ul className="space-y-2">
          {cons.map((con, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
              {con}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
