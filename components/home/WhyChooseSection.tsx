import { Flag, RefreshCw, Shield, Star } from "lucide-react";

const items = [
  {
    icon: Shield,
    title: "Safe APK focus",
    body: "We highlight checksum discipline, mirror hygiene, and permission red flags before you sideload.",
  },
  {
    icon: Star,
    title: "Expert-reviewed metadata",
    body: "Structured version, size, and rating data so listings stay comparable at a glance.",
  },
  {
    icon: Flag,
    title: "Pakistan-first context",
    body: "JazzCash, EasyPaisa, PKR, and CNIC safety notes appear where they matter for local readers.",
  },
  {
    icon: RefreshCw,
    title: "Updated regularly",
    body: "ISR-backed pages and visible updatedAt fields keep earning-app intel fresher than static WP dumps.",
  },
] as const;

export function WhyChooseSection() {
  return (
    <section className="rounded-3xl border border-border-subtle bg-bg-card/25 px-5 py-10 backdrop-blur-md sm:px-8 md:py-12">
      <h2 className="font-display text-2xl font-bold tracking-tight text-text md:text-3xl">
        Why players choose us
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-text-muted md:text-base">
        Editorial tooling built for Pakistan: structured metadata, internal guides, and no
        pay-to-rank listings.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-2xl border border-border-subtle bg-bg-deep/35 p-5 backdrop-blur-sm transition hover:border-accent/30"
          >
            <Icon className="mb-3 size-8 text-accent" aria-hidden />
            <h3 className="font-display font-semibold text-text">{title}</h3>
            <p className="mt-2 text-sm text-text-muted">{body}</p>
          </div>
        ))}
      </div>
      <p className="text-sm leading-relaxed text-text-muted">
        Our editorial stack pairs Next.js App Router performance with structured data and internal
        linking so you spend less time fighting pop-ups and more time verifying the APK you actually
        wanted—whether that is a utility tool or a high-traffic casino title circulating in Lahore,
        Karachi, and Islamabad groups.
      </p>
    </section>
  );
}
