"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";

import { SiteLogoLink } from "@/components/brand/SiteLogoLink";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/stores/use-ui-store";

const links = [
  { href: "/", label: "Home" },
  { href: "/apps", label: "Apps" },
  { href: "/games", label: "Games" },
  { href: "/guides", label: "Guides" },
  { href: "/search", label: "Search" },
];

export function MobileNav() {
  const open = useUiStore((s) => s.mobileNavOpen);
  const setOpen = useUiStore((s) => s.setMobileNavOpen);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 md:hidden" />
        <Dialog.Content className="fixed right-0 top-0 z-50 flex h-full w-[min(100vw-3rem,320px)] flex-col border-l border-border-subtle bg-bg-deep p-6 shadow-2xl md:hidden">
          <div className="mb-8 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <SiteLogoLink size="sm" />
              <Dialog.Title className="font-display truncate text-lg font-bold text-text">
                Menu
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close menu">
                <X className="size-5" />
              </Button>
            </Dialog.Close>
          </div>
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-lg text-text-muted transition hover:text-accent"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
