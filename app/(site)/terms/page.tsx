import type { Metadata } from "next";

import { absoluteUrl, getContactEmail, siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms & conditions",
  description: "Terms of use for HotAPK Games listings and editorial content.",
  alternates: { canonical: absoluteUrl("/terms") },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">
        Terms &amp; conditions
      </h1>
      <p className="text-sm text-muted-foreground">Last updated: 6 April 2026</p>
      <div className="space-y-4 text-muted-foreground">
        <p>
          By using {siteConfig.name} you accept that listings are informational. APKs are provided
          by third parties; you install and use software at your own risk.
        </p>
        <p>
          We are not affiliated with publishers unless explicitly stated. Trademarks belong to their
          owners.
        </p>
        <p>
          <strong className="text-foreground">DMCA:</strong> rights holders may request removal of
          allegedly infringing references via {getContactEmail()} with substantiation.
        </p>
        <section className="space-y-2">
          <h2 className="font-heading text-xl font-semibold text-foreground">Limitation of liability</h2>
          <p>
            {siteConfig.name} is provided “as is.” We are not liable for losses arising from
            third-party software you install, wallet transactions you initiate, or decisions based
            on editorial content.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-heading text-xl font-semibold text-foreground">Acceptable use</h2>
          <p>
            Do not attempt to disrupt the site, scrape it in ways that degrade service for others,
            or misrepresent editorial pages as official publisher support channels.
          </p>
        </section>
      </div>
    </article>
  );
}
