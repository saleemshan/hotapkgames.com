"use client";

import { Share2 } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

const platforms = [
  {
    name: "WhatsApp",
    color: "bg-[#15803d] hover:bg-[#166534]", // green-700 -> green-800
    getUrl: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    name: "Telegram",
    color: "bg-[#2563eb] hover:bg-[#1d4ed8]", // blue-600 -> blue-700
    getUrl: (url: string, title: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "Facebook",
    color: "bg-[#1d4ed8] hover:bg-[#1e3a8a]", // blue-700 -> blue-900
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

export function ShareButtons({ url, title }: ShareButtonsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Share2 className="h-4 w-4 text-muted-foreground" />
      {platforms.map((p) => (
        <a
          key={p.name}
          href={p.getUrl(url, title)}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex min-h-[44px] items-center rounded-lg px-3 text-xs font-medium text-white transition-colors ${p.color}`}
        >
          {p.name}
        </a>
      ))}
    </div>
  );
}
