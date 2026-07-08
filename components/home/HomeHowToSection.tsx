import { Download, Package, Search, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Pick a listing",
    body: "Compare ratings, version, size, and tags before you tap download.",
  },
  {
    icon: Download,
    title: "Use our mirror block",
    body: "Prefer HTTPS links from the page footer—avoid random Telegram APKs.",
  },
  {
    icon: Package,
    title: "Install carefully",
    body: "Allow unknown sources only for your browser session, then revoke after install.",
  },
  {
    icon: ShieldCheck,
    title: "Verify & fund slowly",
    body: "Match file size, read disclaimers, and test a small withdrawal before scaling up.",
  },
] as const;

export function HomeHowToSection() {
  return (
    <section
      className="rounded-3xl border border-border-subtle bg-bg-card/35 px-5 py-10 backdrop-blur-md sm:px-8 md:px-10"
      aria-labelledby="how-apk-heading"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2
          id="how-apk-heading"
          className="font-display text-2xl font-bold text-text md:text-3xl"
        >
          How to use this directory
        </h2>
        <p className="mt-2 text-pretty text-sm text-text-muted md:text-base">
          Same flow as a typical APK hub—except we bias toward{" "}
          <strong className="text-text">metadata you can verify</strong> and honest wallet context
          for Pakistan.
        </p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" role="list">
        {steps.map(({ icon: Icon, title, body }, i) => (
          <div
            role="listitem"
            key={title}
            className="relative flex flex-col rounded-2xl border border-border-subtle bg-bg-deep/40 p-5 pt-8"
          >
            <span
              className="absolute -top-3 left-5 flex size-8 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-bg-deep shadow-lg"
              aria-hidden
            >
              {i + 1}
            </span>
            <Icon className="mb-3 size-7 text-accent" aria-hidden />
            <h3 className="font-display text-base font-semibold text-text">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
