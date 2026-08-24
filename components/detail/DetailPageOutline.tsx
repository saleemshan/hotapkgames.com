import Link from "next/link";

const linkClass =
  "block rounded-lg px-2 py-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground";

export function DetailPageOutline({
  hasScreenshots,
  hasInstall,
  hasFaq,
  hasDownload,
  hasProsCons = true,
  hasRequirements = true,
  hasVersionHistory = true,
  hasReviews = false,
  extraItems = [],
}: {
  hasScreenshots: boolean;
  hasInstall: boolean;
  hasFaq: boolean;
  hasDownload: boolean;
  hasProsCons?: boolean;
  hasRequirements?: boolean;
  hasVersionHistory?: boolean;
  /** User reviews block (after main article). */
  hasReviews?: boolean;
  /** Article H2s from the MDX body. */
  extraItems?: { href: string; label: string }[];
}) {
  const items: { href: string; label: string }[] = [];
  if (hasScreenshots) items.push({ href: "#screenshots", label: "Screenshots" });
  items.push(...extraItems);
  if (hasReviews) items.push({ href: "#reviews", label: "Reader notes" });
  if (hasProsCons) items.push({ href: "#pros-cons", label: "Pros & cons" });
  if (hasRequirements) items.push({ href: "#requirements", label: "System requirements" });
  if (hasVersionHistory) items.push({ href: "#version-history", label: "Version history" });
  if (hasInstall) items.push({ href: "#how-to-download", label: "How to download" });
  if (hasFaq) items.push({ href: "#faq", label: "FAQ" });
  if (hasDownload) items.push({ href: "#download", label: "Download" });

  const seen = new Set<string>();
  const unique = items.filter((l) => {
    if (seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  });

  return (
    <nav
      className="hidden max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-border bg-card/70 p-4 text-sm backdrop-blur-md lg:block"
      aria-label="On this page"
    >
      <p className="mb-2 font-heading text-[0.65rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-0.5">
        {unique.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className={linkClass}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
