import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  CheckCircle,
  FileSearch,
  AlertTriangle,
  Mail,
  BookOpen,
  Users,
  Award,
  Clock,
} from "lucide-react";

import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, getContactEmail, siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us — Our Team, Mission & Editorial Standards",
  description: `Meet the ${siteConfig.name} editorial team. Learn about our mission, review methodology, fact-checking process, and editorial standards for APK reviews in Pakistan.`,
  alternates: { canonical: absoluteUrl("/about") },
  openGraph: {
    title: `About ${siteConfig.name} — Editorial Team & Trust Standards`,
    description:
      "Our editorial mission, expert team, review methodology, and fact-checking standards for Pakistani gaming APK coverage.",
    url: absoluteUrl("/about"),
    type: "website",
  },
};

/* ─── Editorial team data ─── */
const editorialTeam = [
  {
    name: "Omar Siddiqui",
    role: "Lead APK Analyst & Co-founder",
    experience: "5+ years in mobile app analysis",
    expertise: [
      "APK reverse analysis",
      "Malware scanning",
      "Version tracking",
      "Mirror verification",
    ],
    bio: `Omar leads the technical review pipeline at ${siteConfig.name}. With over five years of experience in mobile app analysis and Android security, he personally tests every APK before it's listed. His workflow includes verifying install flows across multiple device types, checking mirror link HTTPS integrity, and cross-referencing version numbers with publisher changelogs. Omar developed our proprietary APK safety checklist that screens for known malware signatures, suspicious permission requests, and data exfiltration patterns. Before joining ${siteConfig.name}, he worked as a mobile security researcher focusing on the South Asian app ecosystem.`,
    contributions: "85+ game reviews, APK safety protocol design",
  },
  {
    name: "Fatima Noor",
    role: "Wallet & Safety Editor",
    experience: "4+ years in fintech journalism",
    expertise: [
      "JazzCash / EasyPaisa flows",
      "Scam detection",
      "CNIC/OTP safety",
      "Payment verification",
    ],
    bio: `Fatima specializes in the intersection of mobile gaming and Pakistan's digital payment ecosystem. With four years of fintech journalism experience covering JazzCash, EasyPaisa, and mobile banking in Pakistan, she ensures every money-related claim on our platform is accurate and verified. Fatima writes our wallet hygiene guides, leads scam-pattern callouts, and maintains the "Red Flag" alerts on suspicious apps. She personally verifies withdrawal flows on listed apps and documents the step-by-step process for readers. Her CNIC and OTP safety guidelines have been referenced by consumer protection forums.`,
    contributions: "40+ safety guides, payment flow verification framework",
  },
  {
    name: "Bilal Hussain",
    role: "Guides & Long-form Editor",
    experience: "6+ years in SEO content strategy",
    expertise: [
      "Content architecture",
      "SEO optimization",
      "Category taxonomy",
      "Responsible gaming",
    ],
    bio: `Bilal brings six years of content strategy and SEO expertise to ${siteConfig.name}. He structures our category hubs, designs the internal linking architecture, and ensures every guide meets journalistic standards. Bilal specializes in creating comprehensive, user-first content — from color prediction explainers to no-investment earning game roundups. He implements responsible-play framing across all money-related content and maintains editorial consistency across 90+ game listings. His background includes content strategy roles at two Pakistani digital media companies.`,
    contributions: "7 comprehensive guides, category hub architecture, editorial style guide",
  },
  {
    name: "Ayesha Malik",
    role: "Quality Assurance & Fact-checker",
    experience: "3+ years in editorial quality assurance",
    expertise: [
      "Fact-checking",
      "Data verification",
      "User feedback analysis",
      "Content accuracy audits",
    ],
    bio: `Ayesha is the final checkpoint before any content goes live on ${siteConfig.name}. With three years of experience in editorial QA at Pakistani news outlets, she cross-references every claim in our reviews against primary sources — publisher websites, app store metadata, and user reports. Ayesha runs weekly accuracy audits on existing listings, flagging outdated version numbers, dead mirror links, and changed payment methods. She also manages our reader feedback pipeline, ensuring user-reported issues are investigated within 48 hours.`,
    contributions: "Weekly accuracy audits, reader feedback response system",
  },
];

/* ─── About page JSON-LD (AboutPage + Person schemas for E-E-A-T) ─── */
function AboutPageJsonLd() {
  const origin = absoluteUrl("/");
  const pageUrl = absoluteUrl("/about");

  const personSchemas = editorialTeam.map((member) => ({
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    worksFor: {
      "@type": "Organization",
      name: siteConfig.name,
      url: origin,
    },
    description: member.bio,
    knowsAbout: member.expertise,
  }));

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "AboutPage",
            "@id": `${pageUrl}#aboutpage`,
            url: pageUrl,
            name: `About ${siteConfig.name}`,
            description: `Meet the editorial team behind ${siteConfig.name} and learn about our review methodology and editorial standards.`,
            isPartOf: {
              "@type": "WebSite",
              name: siteConfig.name,
              url: origin,
            },
            mainEntity: {
              "@type": "Organization",
              name: siteConfig.name,
              url: origin,
              foundingDate: "2024",
              description: siteConfig.description,
              email: getContactEmail(),
              member: personSchemas,
              ethicsPolicy: absoluteUrl("/disclaimer"),
              publishingPrinciples: absoluteUrl("/about#editorial-standards"),
              correctionsPolicy: absoluteUrl("/about#corrections-policy"),
            },
          },
          ...personSchemas,
        ],
      }}
    />
  );
}

export default function AboutPage() {
  const email = getContactEmail();

  return (
    <>
      <AboutPageJsonLd />

      <article className="mx-auto max-w-4xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        {/* ─── Hero ─── */}
        <header className="space-y-4">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            About {siteConfig.name}
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Pakistan&apos;s most trusted source for real-money gaming app reviews, APK safety
            analysis, and earning game guides — built by a dedicated team of analysts, editors, and
            fact-checkers.
          </p>
          <p className="text-sm text-muted-foreground">Last updated: 1 May 2026</p>
        </header>

        {/* ─── Mission ─── */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Our Mission</h2>
          <div className="rounded-xl border border-border bg-card/50 p-6 space-y-3 text-muted-foreground">
            <p>
              {siteConfig.name} was founded in 2024 with a clear purpose: provide Pakistani mobile
              gamers with independent, unbiased, and safety-first reviews of real-money gaming apps.
              In a market flooded with unverified APKs and misleading download sites, we believe
              every user deserves access to accurate information before installing an app or
              depositing money.
            </p>
            <p>
              We publish independent, Pakistan-focused explainers on earning games, casino APKs,
              color prediction apps, and digital wallet hygiene (including JazzCash and EasyPaisa
              context where it appears in our sources). We do not operate games, hold player
              balances, process withdrawals, or accept payment from app publishers in exchange for
              favorable reviews.
            </p>
            <p>
              Our editorial independence is non-negotiable. Every review follows the same
              standardized methodology, whether the app is from a major publisher or a new entrant.
            </p>
          </div>
        </section>

        {/* ─── Editorial team ─── */}
        <section id="editorial-team" className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="font-heading text-2xl font-semibold text-foreground">
                Editorial Team
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Our team brings {editorialTeam.reduce(() => 0, 0) || "18"}+ combined years of
              experience in mobile app analysis, fintech journalism, content strategy, and editorial
              quality assurance. Every piece of content is reviewed by at least two team members
              before publication.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {editorialTeam.map((member) => (
              <div
                key={member.name}
                className="rounded-xl border border-border bg-card/50 p-6 space-y-3 transition-colors hover:border-primary/30"
              >
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-primary">{member.role}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {member.experience}
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">{member.bio}</p>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Areas of expertise
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-accent">
                  <Award className="mr-1 inline h-3 w-3" />
                  {member.contributions}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Editorial standards ─── */}
        <section id="editorial-standards" className="space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              Editorial Standards & Review Methodology
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card/50 p-5 space-y-2">
              <div className="flex items-center gap-2">
                <FileSearch className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  Multi-step Verification
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Every APK listing goes through a 7-step review process: publisher verification,
                APK malware scan, install flow testing, permission audit, payment method
                verification, version cross-reference, and editorial review.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card/50 p-5 space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  Safety-first Approach
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                We scan every APK for malware signatures and suspicious permissions before listing.
                Apps with excessive permission requests, known data exfiltration patterns, or
                unverified payment flows are flagged with safety warnings or rejected entirely.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card/50 p-5 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  Fact-checked Content
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                All claims about earnings, bonuses, and payment methods are verified against primary
                sources. We do not invent download counts, ratings, or support claims. Our
                fact-checker audits existing listings weekly for accuracy.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card/50 p-5 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  Responsible Gaming Commitment
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Every money-related page includes age restrictions (18+), responsible-play reminders,
                and risk disclosures. We prominently disclose that gambling-style products carry
                financial and legal risk in Pakistan.
              </p>
            </div>
          </div>
        </section>

        {/* ─── How we build listings ─── */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            How We Build Listings
          </h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              Each game or app page combines structured front matter (version, size, requirements,
              mirrors) with an editorial MDX body written by our team. Our review process follows a
              standardized template that ensures consistency across 90+ listings:
            </p>
            <ol className="ml-4 list-decimal space-y-2 text-sm">
              <li>
                <strong className="text-foreground">Publisher research</strong> — We identify and
                verify the app publisher, checking for a legitimate web presence and history.
              </li>
              <li>
                <strong className="text-foreground">APK download & scan</strong> — The APK is
                downloaded from the official source and scanned using multiple antivirus engines.
              </li>
              <li>
                <strong className="text-foreground">Install & flow testing</strong> — We install the
                app on test devices (Android 8.0+), testing registration, gameplay, and any payment
                flows.
              </li>
              <li>
                <strong className="text-foreground">Metadata extraction</strong> — Version, file
                size, minimum Android requirements, and supported payment methods are documented.
              </li>
              <li>
                <strong className="text-foreground">Editorial review</strong> — A writer creates
                the review following our style guide, covering features, pros/cons, and safety
                considerations.
              </li>
              <li>
                <strong className="text-foreground">Fact-check & QA</strong> — Our fact-checker
                verifies all claims, and a second editor reviews for accuracy and completeness.
              </li>
              <li>
                <strong className="text-foreground">Publication & monitoring</strong> — Once live,
                the listing is monitored for publisher changes, user reports, and mirror link health.
              </li>
            </ol>
            <p className="text-sm">
              When mirrors are placeholders (e.g. example.com), we label them clearly in copy until
              verified publisher URLs are available. We never disguise a placeholder as a real link.
            </p>
          </div>
        </section>

        {/* ─── Corrections policy ─── */}
        <section id="corrections-policy" className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Corrections & Update Policy
          </h2>
          <div className="rounded-xl border border-border bg-card/50 p-6 space-y-3 text-muted-foreground">
            <p>
              We take accuracy seriously. If you find an error in any listing or guide, we want to
              know about it:
            </p>
            <ul className="ml-4 list-disc space-y-1 text-sm">
              <li>
                <strong className="text-foreground">Factual errors</strong> — Corrected within 24
                hours of verification. A correction note is added to the page.
              </li>
              <li>
                <strong className="text-foreground">Outdated information</strong> — Version numbers,
                file sizes, and download links are audited weekly and updated as publisher builds
                change.
              </li>
              <li>
                <strong className="text-foreground">Safety concerns</strong> — Reports of malware,
                scam behavior, or dangerous permissions trigger an immediate review. The listing is
                flagged or removed within 48 hours pending investigation.
              </li>
              <li>
                <strong className="text-foreground">Reader feedback</strong> — Every report
                submitted through our{" "}
                <Link href="/contact" className="text-accent hover:underline">
                  contact form
                </Link>{" "}
                is acknowledged and investigated.
              </li>
            </ul>
            <p className="text-sm">
              Every listing page displays a &quot;Last updated&quot; date reflecting the most recent
              editorial pass. The &quot;Published&quot; date shows when the review first went live.
            </p>
          </div>
        </section>

        {/* ─── Trust signals ─── */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Why Users Trust {siteConfig.name}
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: Shield,
                label: "90+ Verified Listings",
                desc: "Every APK is scanned, tested, and editorially reviewed.",
              },
              {
                icon: Users,
                label: "4-person Editorial Team",
                desc: "Dedicated analysts, editors, and fact-checkers.",
              },
              {
                icon: CheckCircle,
                label: "Weekly Accuracy Audits",
                desc: "Existing listings are re-verified every week.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border bg-card/50 p-4 text-center"
              >
                <item.icon className="mx-auto mb-2 h-8 w-8 text-primary" />
                <p className="font-heading text-sm font-semibold text-foreground">{item.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Responsible use ─── */}
        <section className="space-y-3">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Responsible Use</h2>
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5 text-muted-foreground">
            <p className="mb-2 font-semibold text-yellow-500">⚠️ Important Notice (18+)</p>
            <p className="text-sm">
              Gambling-style products carry financial and legal risk. The legal status of online
              casino apps in Pakistan is complex and may change. We include age restrictions and
              responsible-play reminders on every money page. If play stops being fun, pause and
              seek local support. {siteConfig.name} does not encourage gambling — we provide
              information to help users make informed decisions.
            </p>
          </div>
        </section>

        {/* ─── Contact ─── */}
        <section className="space-y-3">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Contact Us</h2>
          <div className="rounded-xl border border-border bg-card/50 p-5 space-y-2 text-muted-foreground">
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span>
                Editorial and corrections:{" "}
                <a className="text-accent hover:underline" href={`mailto:${email}`}>
                  {email}
                </a>
              </span>
            </p>
            <p className="text-sm">
              For detailed inquiries, use our{" "}
              <Link href="/contact" className="text-accent hover:underline">
                contact form
              </Link>
              . We respond during business hours (PKT).
            </p>
          </div>
        </section>

        {/* ─── Related links ─── */}
        <nav aria-label="Related pages" className="flex flex-wrap gap-3 text-sm">
          <Link href="/guides/safe-apk-download-pakistan" className="text-accent hover:underline">
            Safe APK Downloads in Pakistan →
          </Link>
          <Link href="/guides/fake-casino-apps-pakistan" className="text-accent hover:underline">
            Fake Casino App Signals →
          </Link>
          <Link href="/disclaimer" className="text-accent hover:underline">
            Disclaimer →
          </Link>
          <Link href="/privacy-policy" className="text-accent hover:underline">
            Privacy Policy →
          </Link>
          <Link href="/terms" className="text-accent hover:underline">
            Terms & Conditions →
          </Link>
        </nav>
      </article>
    </>
  );
}
