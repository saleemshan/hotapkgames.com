"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

const SORTS = [
  { value: "latest", label: "Latest" },
  { value: "views", label: "Most viewed" },
  { value: "rating", label: "Top rated" },
] as const;

export type SortValue = (typeof SORTS)[number]["value"];

export function SortDropdown({ basePath }: { basePath: string }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [pending, startTransition] = useTransition();

  const sort = (sp.get("sort") as SortValue | null) ?? "latest";

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const next = new URLSearchParams(sp.toString());
      next.set("sort", e.target.value);
      next.delete("page");
      startTransition(() => {
        router.push(`${basePath}?${next.toString()}`);
      });
    },
    [basePath, router, sp],
  );

  return (
    <label className="flex items-center gap-2 text-sm text-text-muted">
      <span className="shrink-0">Sort</span>
      <select
        value={sort}
        onChange={onChange}
        disabled={pending}
        className="rounded-lg border border-border-subtle bg-bg-card/80 px-3 py-2 text-text focus:border-accent focus:outline-none"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </label>
  );
}
