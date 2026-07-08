"use client";

import { track } from "@vercel/analytics";
import { Download } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { sendSupabaseEvent } from "@/lib/analytics/track-supabase";
import { cn } from "@/lib/utils";

export function DownloadButton({
  label = "Download APK",
  href,
}: {
  label?: string;
  /** When set, opens mirror in a new tab (first verified HTTPS mirror from the listing). */
  href?: string | null;
}) {
  const trimmed = href?.trim();
  if (trimmed && /^https?:\/\//i.test(trimmed)) {
    return (
      <a
        href={trimmed}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          "animate-pulse-glow inline-flex w-full font-heading text-base font-bold sm:w-auto",
        )}
        onClick={() => {
          track("download_cta_click", { section: "hero", mode: "direct_mirror" });
          sendSupabaseEvent("download_cta_click", { section: "hero", mode: "direct_mirror" });
        }}
      >
        <Download className="size-4" />
        {label}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        buttonVariants({ variant: "default", size: "lg" }),
        "animate-pulse-glow w-full font-heading text-base font-bold sm:w-auto",
      )}
      onClick={() => {
        track("download_cta_click", { section: "hero", mode: "scroll_to_section" });
        sendSupabaseEvent("download_cta_click", { section: "hero", mode: "scroll_to_section" });
        document.getElementById("download")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }}
    >
      <Download className="size-4" />
      {label}
    </button>
  );
}
