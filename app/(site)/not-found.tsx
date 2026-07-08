import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// SEO FIX: 404 must not be indexed as a soft duplicate of other pages.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 text-center">
      <p className="font-mono text-6xl font-bold text-primary">404</p>
      <h1 className="font-heading text-2xl font-bold text-foreground">
        Page not found
      </h1>
      <p className="max-w-md text-muted-foreground">
        The APK or guide you wanted moved. Try search or head back home.
      </p>
      <Link href="/" className={cn(buttonVariants({ variant: "default", size: "lg" }))}>
        Back home
      </Link>
    </div>
  );
}
