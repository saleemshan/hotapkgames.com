"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export function NewBadge({
  className,
  /** `true` = corner badge on relative parent (e.g. image). `false` = inline pill in text rows. */
  pinned = true,
}: {
  className?: string;
  pinned?: boolean;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: pinned ? 0.9 : 1 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "z-10 rounded-md bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-bg-deep shadow-md",
        pinned
          ? "absolute left-2.5 top-2.5"
          : "inline-flex shrink-0 items-center",
        className,
      )}
    >
      New
    </motion.span>
  );
}
