import Link from "next/link";

import { cn } from "@/lib/utils";

function buildHref(
  pathname: string,
  page: number,
  extra: Record<string, string | undefined>,
  hash?: string,
): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(extra)) {
    if (v) sp.set(k, v);
  }
  if (page > 1) sp.set("page", String(page));
  const q = sp.toString();
  const base = q ? `${pathname}?${q}` : pathname;
  const h = hash?.replace(/^#/, "");
  return h ? `${base}#${h}` : base;
}

export function Pagination({
  pathname,
  page,
  totalPages,
  extraParams = {},
  scrollAnchor,
  className,
}: {
  pathname: string;
  page: number;
  totalPages: number;
  extraParams?: Record<string, string | undefined>;
  /** e.g. `section-id` — appended as `#section-id` on every page link */
  scrollAnchor?: string;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) =>
      p === 1 ||
      p === totalPages ||
      (p >= page - 1 && p <= page + 1),
  );

  return (
    <nav
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
      aria-label="Pagination"
    >
      {page > 1 ? (
        <Link
          href={buildHref(pathname, page - 1, extraParams, scrollAnchor)}
          className="rounded-lg border border-border-subtle px-3 py-1.5 text-sm text-text hover:border-accent/40"
        >
          Previous
        </Link>
      ) : null}
      {pages.map((p, idx) => (
        <span key={p} className="flex items-center gap-2">
          {idx > 0 && pages[idx - 1] !== p - 1 ? (
            <span className="text-text-muted">…</span>
          ) : null}
          <Link
            href={buildHref(pathname, p, extraParams, scrollAnchor)}
            className={cn(
              "min-w-9 rounded-lg border px-3 py-1.5 text-center text-sm",
              p === page
                ? "border-accent bg-accent-dim text-accent"
                : "border-border-subtle text-text-muted hover:border-accent/30",
            )}
            {...(p === page ? { "aria-current": "page" as const } : {})}
          >
            {p}
          </Link>
        </span>
      ))}
      {page < totalPages ? (
        <Link
          href={buildHref(pathname, page + 1, extraParams, scrollAnchor)}
          className="rounded-lg border border-border-subtle px-3 py-1.5 text-sm text-text hover:border-accent/40"
        >
          Next
        </Link>
      ) : null}
    </nav>
  );
}
