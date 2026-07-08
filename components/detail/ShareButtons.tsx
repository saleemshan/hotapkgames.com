"use client";

import { Share2 } from "lucide-react";
import { useMemo } from "react";

import { absoluteUrl } from "@/lib/seo";

const platforms = [
  {
    name: "WhatsApp",
    color: "bg-[#15803d] hover:bg-[#166534]",
    getUrl: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    name: "Telegram",
    color: "bg-[#2563eb] hover:bg-[#1d4ed8]",
    getUrl: (url: string, title: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "Facebook",
    color: "bg-[#1d4ed8] hover:bg-[#1e3a8a]",
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "X",
    color: "bg-neutral-800 hover:bg-neutral-700",
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
];

export function ShareButtons({
  urlPath,
  title,
}: {
  urlPath: string;
  title: string;
  /** @deprecated no longer used — kept for backwards-compat */
  floatingMobile?: boolean;
}) {
  const url = useMemo(() => absoluteUrl(urlPath), [urlPath]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Share2 className="h-4 w-4 shrink-0 text-muted-foreground" />
      {platforms.map((p) => (
        <a
          key={p.name}
          href={p.getUrl(url, title)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${p.name}`}
          className={`inline-flex min-h-[44px] items-center rounded-lg px-3 text-xs font-medium text-white transition-colors ${p.color}`}
        >
          {p.name}
        </a>
      ))}
    </div>
  );
}
