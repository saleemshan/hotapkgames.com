import type { Metadata } from "next";

import { absoluteUrl, getContactEmail } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How HotAPK Games handles analytics, cookies, and visitor data.",
  alternates: { canonical: absoluteUrl("/privacy-policy") },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">Privacy policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: 6 April 2026</p>
      <div className="space-y-4 text-muted-foreground">
        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">Data we collect</h2>
          <p>
            Vercel Analytics and Speed Insights may process anonymised performance metrics. Search
            queries typed on <code className="text-accent">/search</code> stay in your browser when
            using the default Fuse.js UI unless you call our search API.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">Cookies</h2>
          <p>
            Theme preference may be stored locally via <code className="text-accent">localStorage</code>{" "}
            for dark/light mode. No ad tracking pixels are shipped in this starter.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">Third parties</h2>
          <p>
            Outbound download mirrors are operated by publishers we do not control. Their privacy
            policies apply once you leave this site.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">Contact</h2>
          {/* SEO FIX: Operational inbox from env (NEXT_PUBLIC_CONTACT_EMAIL) with sensible fallback. */}
          <p>{getContactEmail()}</p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">Children</h2>
          <p>
            Content is aimed at adults (18+). We do not knowingly collect personal information from
            minors.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">Changes</h2>
          <p>
            We may update this policy when analytics vendors or hosting features change. The “Last
            updated” date at the top reflects the latest editorial pass.
          </p>
        </section>
      </div>
    </article>
  );
}
