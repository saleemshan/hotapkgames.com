"use client";

import Link from "next/link";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { cn } from "@/lib/utils";

const heightClass = {
  sm: "h-11",
  md: "h-14 md:h-16",
  lg: "h-20 sm:h-24 md:h-28",
} as const;

export function SiteLogoLink({
  size = "md",
  className,
  priority = false,
}: {
  size?: keyof typeof heightClass;
  className?: string;
  priority?: boolean;
}) {
  const h = heightClass[size];
  return (
    <Link
      href="/"
      className={cn("flex items-center bg-transparent", h, className)}
    >
      <BrandLogo size={size} priority={priority} />
    </Link>
  );
}
