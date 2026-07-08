"use client";

import Link from "next/link";
import { useState } from "react";
import { Gamepad2, Menu, Search } from "lucide-react";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/lib/seo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Games" },
  { href: "/category/casino-games", label: "Casino Games" },
  { href: "/category/color-prediction", label: "Color Prediction" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex min-h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 font-heading text-xl font-bold"
        >
          <BrandLogo size="md" priority />
          <span className="hidden sm:inline">
            HotAPK{" "}
            <span className="text-orange-500 dark:text-orange-400">Games</span>
          </span>
          <span className="sr-only">{siteConfig.name}</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link href="/search">
            <Button
              variant="ghost"
              size="icon"
              className="size-11 text-muted-foreground hover:text-foreground"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-border bg-card">
              <SheetTitle className="flex items-center gap-2 p-4 font-heading text-lg">
                <Gamepad2 className="h-5 w-5 text-orange-500" />
                Menu
              </SheetTitle>
              <nav className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
