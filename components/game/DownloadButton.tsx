"use client";

import { Download } from "lucide-react";
import { track } from "@vercel/analytics";

import { sendSupabaseEvent } from "@/lib/analytics/track-supabase";

interface DownloadButtonProps {
  url: string;
  gameName: string;
  sticky?: boolean;
}

export function DownloadButton({ url, gameName, sticky = false }: DownloadButtonProps) {
  const handleClick = () => {
    track("download_click", { game: gameName, url });
    sendSupabaseEvent("download_click", { game: gameName, url });
  };

  const button = (
    <a
      href={url}
      target="_blank"
      rel="nofollow noopener noreferrer"
      onClick={handleClick}
      aria-label={`Download ${gameName} APK`}
      className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl gradient-primary px-4 sm:px-6 h-12 sm:h-14 text-base sm:text-lg font-heading font-bold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all motion-safe:animate-pulse hover:animate-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Download className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="truncate">Download APK</span>
    </a>
  );

  if (sticky) {
    return (
      <div
        data-sticky-download="true"
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 px-3 pt-3 backdrop-blur-md md:hidden"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
      >
        {button}
      </div>
    );
  }

  return button;
}
