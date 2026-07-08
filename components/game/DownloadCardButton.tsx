"use client";

import { Download } from "lucide-react";
import { track } from "@vercel/analytics";

import { sendSupabaseEvent } from "@/lib/analytics/track-supabase";

interface DownloadCardButtonProps {
  url: string;
  gameName: string;
}

export function DownloadCardButton({ url, gameName }: DownloadCardButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="nofollow noopener noreferrer"
      onClick={() => {
        track("download_click", { game: gameName, url });
        sendSupabaseEvent("download_click", { game: gameName, url });
      }}
      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg gradient-primary px-3 py-2 text-xs font-bold text-white hover:scale-[1.02] transition-transform"
    >
      <Download className="h-3.5 w-3.5" />
      Download APK
    </a>
  );
}
