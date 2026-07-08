import Link from "next/link";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/seo";

const footerLinks = [
  {
    title: "Categories",
    links: [
      { href: "/category/casino-games", label: "Casino Games" },
      { href: "/category/color-prediction", label: "Color Prediction" },
      { href: "/category/card-games", label: "Card Games" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/disclaimer", label: "Disclaimer" },
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/guides", label: "Guides" },
      { href: "/games", label: "All Games" },
      { href: "/about", label: "About Us" },
      { href: "/search", label: "Search Games" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="flex items-center gap-3 font-heading text-lg font-bold"
            >
              <BrandLogo size="sm" />
              <span>
                HotAPK{" "}
                <span className="text-orange-500 dark:text-orange-400">
                  Games
                </span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>
          {footerLinks.map((section) => (
            <nav key={section.title} aria-label={`${section.title} navigation`}>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <Separator className="my-8" />
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
          reserved. This site is for informational purposes only.
        </p>
      </div>
    </footer>
  );
}
