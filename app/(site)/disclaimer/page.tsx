import type { Metadata } from "next";

import { absoluteUrl, getContactEmail, siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Responsible gambling and editorial disclaimer for HotAPK Games.",
  alternates: { canonical: absoluteUrl("/disclaimer") },
};

export default function DisclaimerPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">Disclaimer</h1>
      <p className="text-sm text-muted-foreground">Last updated: 6 April 2026</p>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p className="font-semibold text-danger">
          18+ only. Gambling can be addictive. If you need help, seek professional support.
        </p>
        <p>
          {siteConfig.name} publishes editorial descriptions and metadata about third-party APKs
          and games. We do not operate real-money games, hold player funds, or process withdrawals.
        </p>
        <p>
          Laws around online betting and casino-style apps vary in Pakistan and may change. You are
          responsible for compliance with local regulations before installing or funding any app.
        </p>
        <section className="space-y-2">
          <h2 className="font-heading text-xl font-semibold text-foreground">Editorial accuracy</h2>
          <p>
            Version, size, and mirror fields are editorial snapshots. They can drift from live
            publisher builds. Always verify after download and before transferring PKR.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-heading text-xl font-semibold text-foreground">Third-party links</h2>
          <p>
            Outbound mirrors and screenshots may point to domains we do not control. Their terms and
            privacy policies apply when you leave this site.
          </p>
        </section>
        <p>Contact: {getContactEmail()}</p>
      </div>
    </article>
  );
}
