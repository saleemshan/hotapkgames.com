"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

export function ReviewForm({
  gameSlug,
  gameTitle,
}: {
  gameSlug: string;
  gameTitle: string;
}) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot.length > 0) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameSlug,
          name,
          city: city.trim() || undefined,
          rating,
          comment,
          website: honeypot,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string; error?: string };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }
      setStatus("success");
      setMessage(data.message ?? "Thanks!");
      setName("");
      setCity("");
      setRating(5);
      setComment("");
    } catch {
      setStatus("error");
      setMessage("Network error — try again.");
    }
  }

  return (
    <section
      className="rounded-2xl border border-border bg-card/60 p-5"
      aria-labelledby="review-form-heading"
    >
      <h3 id="review-form-heading" className="font-heading text-lg font-semibold text-foreground">
        Share your experience
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Short feedback about <span className="font-medium text-foreground">{gameTitle}</span>.
        Submissions are moderated before they appear in the public list.
      </p>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="review-name" className="text-xs font-medium text-foreground">
              Name
            </label>
            <Input
              id="review-name"
              name="name"
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="review-city" className="text-xs font-medium text-foreground">
              City <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input
              id="review-city"
              name="city"
              maxLength={80}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              autoComplete="address-level2"
            />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-medium text-foreground">Rating</span>
          <div className="flex flex-wrap gap-1" role="radiogroup" aria-label="Star rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                className={cn(
                  "rounded-md border px-2 py-1 text-sm transition-colors",
                  rating === n
                    ? "border-purple-700 dark:border-purple-400 bg-purple-700/10 dark:bg-purple-400/10 text-purple-700 dark:text-purple-400"
                    : "border-border bg-background text-muted-foreground hover:bg-muted",
                )}
                onClick={() => setRating(n)}
              >
                {n} ★
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="review-comment" className="text-xs font-medium text-foreground">
            Comment
          </label>
          <textarea
            id="review-comment"
            name="comment"
            required
            minLength={20}
            maxLength={4000}
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[96px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Honeypot */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="review-website">Website</label>
          <input
            id="review-website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
          {status === "success" ? <span className="text-purple-700 dark:text-purple-400">{message}</span> : null}
          {status === "error" ? <span className="text-destructive">{message}</span> : null}
        </div>

        <Button type="submit" size="sm" disabled={status === "loading"} className="w-full sm:w-auto">
          {status === "loading" ? "Submitting…" : "Submit review"}
        </Button>
      </form>
    </section>
  );
}
