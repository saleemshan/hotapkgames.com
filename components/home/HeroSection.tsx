"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { HeroSearch } from "@/components/home/HeroSearch";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE_HERO_IMAGE } from "@/lib/site-media";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border-subtle bg-bg-card/50 px-5 py-10 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-md sm:px-8 md:px-12 md:py-14">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -left-24 top-0 size-80 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute -right-20 bottom-0 size-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 size-[min(100vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
      </div>
      <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-accent"
          >
            Pakistan · PKR · 2026 directory
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-3 font-display text-3xl font-bold leading-[1.12] tracking-tight text-text md:text-4xl lg:text-5xl"
          >
            Real earning games &amp; APK reviews you can actually verify
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.45 }}
            className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-text-muted md:text-lg"
          >
            Independent listings for color-prediction and casino-style apps: version, size, ratings,
            JazzCash / EasyPaisa context, and sideload hygiene—without fake “guaranteed profit” noise.
          </motion.p>
          <HeroSearch />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.45 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href="/games"
              className={cn(buttonVariants({ size: "lg" }), "font-heading")}
            >
              Browse games
            </Link>
            <Link
              href="/guides"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "font-heading")}
            >
              Read guides
            </Link>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="relative mx-auto aspect-[16/10] w-full max-w-xl overflow-hidden rounded-2xl border border-accent/25 shadow-[0_0_48px_rgba(0,255,136,0.12)] lg:mx-0"
        >
          <Image
            src={SITE_HERO_IMAGE.src}
            alt={SITE_HERO_IMAGE.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 560px"
            priority
            className="object-cover object-center"
          />
        </motion.div>
      </div>
    </section>
  );
}
