const reviews = [
  {
    name: "Hassan R.",
    place: "Lahore",
    rating: 5,
    text: "Finally a site that explains withdrawal limits before I deposit. The game pages are long but honest—saved me from a sketchy mirror.",
  },
  {
    name: "Ayesha K.",
    place: "Karachi",
    rating: 5,
    text: "I use this for comparing color-prediction apps. Love that each listing shows version and size; makes it easier to spot outdated APKs.",
  },
  {
    name: "Bilal M.",
    place: "Islamabad",
    rating: 4,
    text: "Good write-ups on JazzCash / EasyPaisa context. Wish more games had video proof, but the install steps are clear.",
  },
  {
    name: "Sana T.",
    place: "Faisalabad",
    rating: 5,
    text: "The guides section helped me understand bonus wagering. Feels less spammy than random Facebook groups pushing referral links.",
  },
  {
    name: "Omar N.",
    place: "Rawalpindi",
    rating: 4,
    text: "Straightforward pros/cons tables. I still verify on official channels, but this is my first stop before downloading anything.",
  },
  {
    name: "Zainab H.",
    place: "Multan",
    rating: 5,
    text: "Fast pages on mobile. I share links with cousins who ask which earning apps are legit—metadata alone is worth bookmarking.",
  },
] as const;

function Stars({ value }: { value: number }) {
  return (
    <span className="text-gold" aria-label={`${value} out of 5 stars`}>
      {"★".repeat(value)}
      <span className="text-text-muted/40">{"★".repeat(5 - value)}</span>
    </span>
  );
}

export function UserReviewsSection() {
  return (
    <section
      className="rounded-3xl border border-border-subtle bg-bg-card/25 px-5 py-10 backdrop-blur-md sm:px-8 md:py-12"
      aria-labelledby="reviews-heading"
    >
      <div className="max-w-2xl space-y-2">
        <h2
          id="reviews-heading"
          className="font-display text-2xl font-bold tracking-tight text-text md:text-3xl"
        >
          Reader feedback
        </h2>
        <p className="text-pretty text-sm text-text-muted md:text-base">
          Illustrative comments from players who use our guides to compare APKs,
          bonuses, and cash-out options in Pakistan—always double-check on the
          official app or site before you deposit.
        </p>
      </div>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <li
            key={r.name}
            className="flex flex-col rounded-2xl border border-border-subtle bg-bg-deep/40 p-5 shadow-md backdrop-blur-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-text">{r.name}</p>
              <Stars value={r.rating} />
            </div>
            <p className="mt-1 text-xs text-text-muted">{r.place}</p>
            <blockquote className="mt-3 flex-1 border-l-2 border-accent/40 pl-3 text-sm leading-relaxed text-text-muted">
              <p className="text-pretty text-text/90">&ldquo;{r.text}&rdquo;</p>
            </blockquote>
          </li>
        ))}
      </ul>
    </section>
  );
}
