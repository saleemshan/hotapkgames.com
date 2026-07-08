"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { useState } from "react";

/**
 * Heuristic: if the file path encodes an aspect hint (e.g. -landscape, -banner)
 * use 16/9; otherwise default to 9/16 portrait (most casino app screenshots are phone screens).
 * The Image is `object-contain` inside the box so it never crops awkwardly either way.
 */
function aspectFor(src: string): string {
  const lower = src.toLowerCase();
  if (
    lower.includes("landscape") ||
    lower.includes("banner") ||
    lower.includes("lobby") ||
    lower.includes("desktop") ||
    lower.includes("logo")
  ) {
    return "aspect-video"; // 16/9
  }
  return "aspect-[9/16]";
}

export function ScreenshotGallery({
  urls,
  productTitle,
}: {
  urls: string[];
  /** SEO FIX: Contextual alts for gallery images (app/game name). */
  productTitle?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  if (!urls.length) return null;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {urls.map((src, i) => {
          const aspect = aspectFor(src);
          return (
            <button
              key={`screenshot-${i}`}
              type="button"
              onClick={() => {
                setActive(i);
                setOpen(true);
              }}
              className={`relative ${aspect} w-full overflow-hidden rounded-lg border border-border-subtle bg-bg-deep transition hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
              aria-label={
                productTitle
                  ? `Open ${productTitle} screenshot ${i + 1}`
                  : `Open screenshot ${i + 1}`
              }
            >
              <Image
                key={`screenshot-img-${i}`}
                src={src}
                alt={
                  productTitle
                    ? `${productTitle} screenshot ${i + 1}`
                    : `Screenshot ${i + 1}`
                }
                fill
                className="object-contain"
                sizes="(max-width:640px) 50vw, 33vw"
                loading="lazy"
              />
            </button>
          );
        })}
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(100vw-1rem,900px)] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-border-subtle bg-bg-deep p-2 shadow-2xl outline-none">
          <Dialog.Title className="sr-only">Screenshot preview</Dialog.Title>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
            <Image
              src={urls[active] ?? urls[0]}
              alt={
                productTitle
                  ? `${productTitle} screenshot preview`
                  : "Screenshot preview"
              }
              fill
              className="object-contain"
              sizes="(max-width: 900px) 100vw, 900px"
            />
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <button
              type="button"
              className="min-h-[44px] rounded-lg border border-border-subtle px-4 py-2 text-sm text-text"
              onClick={() => setActive((a) => (a > 0 ? a - 1 : urls.length - 1))}
              aria-label="Previous screenshot"
            >
              Prev
            </button>
            <Dialog.Close
              className="min-h-[44px] rounded-lg border border-border-subtle px-4 py-2 text-sm text-text"
              aria-label="Close screenshot preview"
            >
              Close
            </Dialog.Close>
            <button
              type="button"
              className="min-h-[44px] rounded-lg border border-border-subtle px-4 py-2 text-sm text-text"
              onClick={() => setActive((a) => (a < urls.length - 1 ? a + 1 : 0))}
              aria-label="Next screenshot"
            >
              Next
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
