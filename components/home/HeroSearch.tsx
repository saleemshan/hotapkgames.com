"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const t = q.trim();
    router.push(t ? `/search?q=${encodeURIComponent(t)}` : "/search");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative mt-6 max-w-xl"
      role="search"
      aria-label="Search games and guides"
    >
      <label className="sr-only" htmlFor="hero-search-q">
        Search
      </label>
      <input
        id="hero-search-q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search games, apps, guides…"
        className="h-12 w-full rounded-xl border border-border-subtle bg-bg-deep/60 py-2 pl-4 pr-12 text-sm text-text placeholder:text-text-muted shadow-inner backdrop-blur-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg bg-accent text-bg-deep transition hover:brightness-110"
        aria-label="Submit search"
      >
        <Search className="size-4" aria-hidden />
      </button>
    </form>
  );
}
