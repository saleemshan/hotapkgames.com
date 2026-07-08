"use client";

import Image from "next/image";

import { getSiteLogoForTheme } from "@/lib/site-media";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/use-theme-store";

const heightClass = {
  sm: "h-11",
  md: "h-14 md:h-16",
  lg: "h-20 sm:h-24 md:h-28",
} as const;

export function BrandLogo({
  size = "md",
  className,
  priority = false,
}: {
  size?: keyof typeof heightClass;
  className?: string;
  priority?: boolean;
}) {
  const theme = useThemeStore((s) => s.theme);
  const logo = getSiteLogoForTheme(theme);
  const h = heightClass[size];

  return (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
      priority={priority}
      quality={95}
      sizes={
        size === "lg" ? "280px" : size === "sm" ? "120px" : "(max-width: 768px) 160px, 200px"
      }
      className={cn(h, "w-auto shrink-0 object-contain", className)}
    />
  );
}
