"use client";

import { track } from "@vercel/analytics";
import { ExternalLink } from "lucide-react";

import { sendSupabaseEvent } from "@/lib/analytics/track-supabase";

export function DownloadMirrorLinks({ links }: { links: string[] }) {
  if (!links.length) return null;
  return (
    <ul className="space-y-3">
      {links.map((url, i) => (
        <li key={url}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              track("download_mirror_click", { index: i });
              sendSupabaseEvent("download_mirror_click", { index: i });
            }}
            className="flex items-center justify-between gap-3 rounded-xl border border-accent/30 bg-accent-dim/30 px-4 py-3 font-medium text-accent transition hover:bg-accent-dim/50"
          >
            <span>Mirror {i + 1}</span>
            <ExternalLink className="size-4 shrink-0" />
          </a>
        </li>
      ))}
    </ul>
  );
}
