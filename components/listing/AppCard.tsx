"use client";

import { track } from "@vercel/analytics";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { NewBadge } from "@/components/ui/NewBadge";
import { VersionBadge } from "@/components/ui/VersionBadge";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/button";
import { StarRating } from "@/components/listing/StarRating";
import { sendSupabaseEvent } from "@/lib/analytics/track-supabase";
import { formatPkDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type AppCardModel = {
  title: string;
  href: string;
  coverImage: string;
  version: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  rating: number;
  votes: number;
  isNew?: boolean;
  featured?: boolean;
  shortDescription?: string;
  size?: string;
  downloads?: string;
  /** First HTTPS/HTTP mirror — card Download opens this in a new tab when set. */
  directDownloadUrl?: string | null;
};

const categoryLabels: Record<string, string> = {
  tools: "Tools",
  injectors: "Injectors",
  utilities: "Utilities",
  apps: "Apps",
  "casino-games": "Casino",
  "color-prediction": "Color",
  "sports-betting": "Sports",
  "card-games": "Cards",
};

function MetaChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-lg border border-border/80 bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur-sm">
      {children}
    </span>
  );
}

function StatusLine({ item }: { item: AppCardModel }) {
  if (item.updatedAt)
    return (
      <span className="text-[11px] text-muted-foreground">
        Updated {formatPkDate(item.updatedAt)}
      </span>
    );
  return (
    <span className="text-[11px] text-muted-foreground">Listed {formatPkDate(item.publishedAt)}</span>
  );
}

export function AppCard({
  item,
  index = 0,
  compact = false,
}: {
  item: AppCardModel;
  index?: number;
  compact?: boolean;
}) {
  const label =
    categoryLabels[item.category] ?? item.category.replace(/-/g, " ");

  if (compact) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04, duration: 0.3 }}
        className="flex gap-3 rounded-xl border border-border bg-card/50 p-3 backdrop-blur-sm"
      >
        <Link href={item.href} className="relative size-16 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={item.coverImage}
            alt={item.title}
            width={64}
            height={64}
            className="size-full object-cover"
            sizes="64px"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={item.href}
            className="line-clamp-2 font-heading text-sm font-semibold text-foreground hover:text-accent"
          >
            {item.title}
          </Link>
          <StarRating rating={item.rating} votes={item.votes} className="mt-1 scale-90" />
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.38 }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/90 bg-card/50 shadow-[0_4px_24px_rgba(0,0,0,0.25)] backdrop-blur-md transition duration-300",
        "hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-[0_16px_48px_rgba(0,255,136,0.12)]",
      )}
    >
      <div
        className="h-0.5 bg-linear-to-r from-transparent via-accent to-transparent opacity-80"
        aria-hidden
      />

      <Link
        href={item.href}
        className="relative isolate block aspect-5/4 w-full overflow-hidden bg-muted sm:aspect-16/10"
      >
        <Image
          src={item.coverImage}
          alt={item.title}
          fill
          className="object-cover transition duration-500 ease-out group-hover:scale-[1.05]"
          sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 380px"
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-bg-deep via-bg-deep/25 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-bg-deep/95 to-transparent" aria-hidden />

        {item.isNew ? <NewBadge /> : null}
        {item.featured ? (
          <span className="absolute right-3 top-3 z-10 rounded-lg border border-gold/50 bg-gold/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-bg-deep shadow-md backdrop-blur-sm">
            Top pick
          </span>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 p-4 pt-10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="shadow-sm">
              {label}
            </Badge>
            <VersionBadge version={item.version} className="border-white/10 bg-black/35 text-foreground" />
          </div>
          <h3 className="mt-2 line-clamp-2 font-heading text-lg font-bold leading-snug tracking-tight text-foreground drop-shadow-md sm:text-xl">
            {item.title}
          </h3>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4 pt-3">
        {!item.isNew ? (
          <div className="flex flex-wrap items-center gap-2">
            <StatusLine item={item} />
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {item.downloads ? (
            <MetaChip>
              <span className="text-accent">{item.downloads}</span>
              <span className="ml-1 opacity-90">downloads</span>
            </MetaChip>
          ) : null}
          {item.size ? (
            <MetaChip>
              <span className="text-foreground/90">{item.size}</span>
            </MetaChip>
          ) : null}
        </div>

        <StarRating
          rating={item.rating}
          votes={item.votes}
          className="[&_.font-mono]:text-sm [&_svg]:size-3.5"
        />

        {item.shortDescription ? (
          <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {item.shortDescription}
          </p>
        ) : (
          <div className="flex-1" />
        )}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 border-t border-border/80 bg-muted/40 p-3 sm:p-4">
        {item.directDownloadUrl ? (
          <a
            href={item.directDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "default" }),
              "h-11 font-heading text-sm font-bold shadow-md sm:h-10",
            )}
            onClick={() => {
              track("download_cta_click", { section: "card", mode: "direct_mirror" });
              sendSupabaseEvent("download_cta_click", { section: "card", mode: "direct_mirror" });
            }}
          >
            <Download className="size-4 shrink-0" aria-hidden />
            Download
          </a>
        ) : (
          <Link
            href={`${item.href}#download`}
            className={cn(
              buttonVariants({ size: "default" }),
              "h-11 font-heading text-sm font-bold shadow-md sm:h-10",
            )}
            onClick={() => {
              track("download_cta_click", { section: "card", mode: "scroll_listing" });
              sendSupabaseEvent("download_cta_click", { section: "card", mode: "scroll_listing" });
            }}
          >
            <Download className="size-4 shrink-0" aria-hidden />
            Download
          </Link>
        )}
        <Link
          href={item.href}
          className={cn(
            buttonVariants({ variant: "outline", size: "default" }),
            "inline-flex h-11 items-center justify-center gap-1.5 border-border bg-card font-heading text-sm font-semibold sm:h-10",
          )}
        >
          Review
          <ArrowRight
            className="size-4 opacity-80 transition group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </motion.article>
  );
}
