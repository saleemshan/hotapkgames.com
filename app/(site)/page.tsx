import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  Search,
  Shield,
  Download,
  RefreshCw,
  ArrowRight,
  Star,
  Zap,
  CreditCard,
  Smartphone,
  CheckCircle,
} from "lucide-react";

import { FAQAccordion } from "@/components/mdx/FAQAccordion";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { GeneralGuidesSection } from "@/components/home/GeneralGuidesSection";
import { UserReviews } from "@/components/game/UserReviews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GameGrid } from "@/components/game/GameGrid";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getAllGames,
  getFeaturedGames,
  getGamesByCategory,
  getLatestGames,
  getTotalDownloads,
  getTotalGamesCount,
} from "@/lib/games";
import { getSiteReviews } from "@/lib/reviews";
import {
  absoluteUrl,
  getOrganizationSchemaId,
  siteConfig,
} from "@/lib/seo";

export const revalidate = 3600;

const homeFAQs = [
  {
    question: "What are earning games?",
    answer:
      "Apps where you play games to earn money, supporting EasyPaisa and JazzCash withdrawals in Pakistan.",
  },
  {
    question: "Are APK downloads safe?",
    answer:
      "Yes, if downloaded from verified official mirrors. We scan all listed APKs for safety.",
  },
  {
    question: "How to install an APK?",
    answer:
      "Enable 'Unknown Sources' in Android settings, open the downloaded APK file, and tap install.",
  },
  {
    question: "Can I withdraw real money?",
    answer:
      "Yes, you can transfer your winnings directly to your local EasyPaisa or JazzCash account.",
  },
  {
    question: "Which wallets are supported?",
    answer:
      "EasyPaisa and JazzCash are the primary mobile wallet methods supported in Pakistan.",
  },
  {
    question: "Are these apps legal?",
    answer:
      "They operate in a legal grey zone in Pakistan. Play responsibly with disposable funds.",
  },
];

export const metadata: Metadata = {
  title: siteConfig.defaultTitle,
  description: siteConfig.description,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
  },
};

/** Site-wide aggregate from approved reviews — merged onto `Organization` via `@id` (not `WebSite`; avoids invalid child types in GSC). */
function HomeReviewSchema() {
  const reviews = getSiteReviews();
  if (reviews.length === 0) return null;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const ratingValue = Math.round(avg * 10) / 10;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": getOrganizationSchemaId(),
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue,
              ratingCount: reviews.length,
              bestRating: 5,
              worstRating: 1,
            },
          },
        ],
      }}
    />
  );
}

function HowToSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to Download & Install Earning Game APKs in Pakistan",
        description:
          "Step-by-step guide to download and install earning game APKs on your Android phone in Pakistan.",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Choose a Game",
            text: "Browse our collection and pick an earning game that matches your interest — casino, color prediction, or sports betting.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Download the APK",
            text: "Click the 'Download APK' button on the game page. The APK file will start downloading to your phone.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Enable Unknown Sources",
            text: "Go to Settings > Security > Install Unknown Apps and enable it for your browser.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Install the APK",
            text: "Open the downloaded APK file and tap Install. Wait for installation to complete.",
          },
          {
            "@type": "HowToStep",
            position: 5,
            name: "Sign Up & Claim Bonus",
            text: "Open the app, create an account, and claim your free signup bonus. Start playing and earn real money!",
          },
        ],
      }}
    />
  );
}

async function StatsSection() {
  const [totalDownloads, totalGames] = await Promise.all([
    getTotalDownloads(),
    getTotalGamesCount(),
  ]);

  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 font-heading text-3xl font-bold text-primary">
          <Download className="h-7 w-7" />
          {totalDownloads.toLocaleString()}+
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Total Downloads</p>
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 font-heading text-3xl font-bold text-accent">
          <Shield className="h-7 w-7" />
          {totalGames}+
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Verified Games</p>
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 font-heading text-3xl font-bold text-yellow-400">
          <Star className="h-7 w-7" />
          4.8/5
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Avg Rating</p>
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 font-heading text-3xl font-bold text-green-400">
          <RefreshCw className="h-7 w-7" />
          Daily
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Updates</p>
      </div>
    </div>
  );
}

async function FeaturedSection() {
  const featured = await getFeaturedGames(6);
  if (featured.length === 0) return null;

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">
            Top Earning Games Pakistan 2026 – Free Bonus
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Download the highest-rated earning apps with free signup bonuses up
            to Rs 1000
          </p>
        </div>
      </div>
      <GameGrid games={featured} />
    </section>
  );
}

async function LatestSection() {
  const latest = await getLatestGames(12, 0);
  if (latest.length === 0) return null;

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">
            Latest Earning Apps & Casino APKs
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Newest listings first—fresh APKs with JazzCash & Easypaisa support
          </p>
        </div>
      </div>
      <GameGrid games={latest} />
    </section>
  );
}

async function CasinoSection() {
  const { games } = await getGamesByCategory("casino-games", 1, 6);
  if (games.length === 0) return null;

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">
            Casino Game APKs – Slots, Teen Patti & Live Casino
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Best casino games for Pakistan with real money withdrawals
          </p>
        </div>
        <Link href="/category/casino-games">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80"
          >
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <GameGrid games={games} columns={3} />
    </section>
  );
}

function SiteReviewsSection() {
  const reviews = getSiteReviews();
  return <UserReviews reviews={reviews} gameName={siteConfig.name} />;
}

function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "Verified & Safe APKs",
      desc: "Every APK is scanned for malware. We test each app before listing. 100% safe downloads guaranteed.",
    },
    {
      icon: Zap,
      title: "Free Signup Bonuses",
      desc: "Get Rs 200 to Rs 1000 free bonus on signup. No deposit required. Start earning immediately.",
    },
    {
      icon: CreditCard,
      title: "JazzCash & Easypaisa",
      desc: "All apps support Pakistani payment methods. Withdraw earnings to JazzCash, Easypaisa, or bank.",
    },
    {
      icon: Smartphone,
      title: "Works on Budget Phones",
      desc: "Optimized APKs from 8 MB to 150 MB. Works on Android 5.0+ with 2G/3G/4G connections.",
    },
    {
      icon: RefreshCw,
      title: "Updated Daily",
      desc: "New apps, updated links, and fresh reviews every day. Never miss a new earning opportunity.",
    },
    {
      icon: Star,
      title: "Real User Reviews",
      desc: "Honest reviews from Pakistani players. See real earnings, withdrawal proofs, and tips.",
    },
  ];

  return (
    <section>
      <h2 className="mb-2 text-center font-heading text-2xl font-bold">
        Why Pakistani Players Trust {siteConfig.name}
      </h2>
      <p className="mb-8 text-center text-sm text-muted-foreground">
        The most reliable source for earning game APK downloads in Pakistan since
        2024
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
          >
            <f.icon className="mb-3 h-8 w-8 text-primary" />
            <h3 className="mb-1 font-heading text-sm font-semibold">{f.title}</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowToDownload() {
  const steps = [
    {
      step: 1,
      title: "Choose a Game",
      desc: "Browse our collection of verified earning games. Each app shows ratings, reviews, and bonus info.",
    },
    {
      step: 2,
      title: "Download APK",
      desc: "Tap the 'Download APK' button. The file downloads directly — no redirects or ads.",
    },
    {
      step: 3,
      title: "Install on Android",
      desc: "Enable 'Install from Unknown Sources' in settings. Open the APK and tap Install.",
    },
    {
      step: 4,
      title: "Sign Up & Earn",
      desc: "Create your account, claim your free bonus (Rs 200–1000), and start earning real money!",
    },
  ];

  return (
    <section>
      <h2 className="mb-2 text-center font-heading text-2xl font-bold">
        How to Download Earning Game APKs
      </h2>
      <p className="mb-8 text-center text-sm text-muted-foreground">
        Start earning real money in under 2 minutes
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div
            key={s.step}
            className="relative rounded-xl border border-border bg-card p-5 text-center"
          >
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-lg font-bold text-white">
              {s.step}
            </div>
            <h3 className="mb-1 font-heading text-sm font-semibold">{s.title}</h3>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <a
          href="https://jfmj417538-auguayhbendnbbbe.a02.azurefd.net/?dl=4hp7fx"
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-bold text-white shadow-lg gradient-primary transition-all hover:scale-105 hover:opacity-95"
        >
          <Download className="h-5 w-5" />
          Download Official APK (Fast &amp; Free)
        </a>
      </div>
    </section>
  );
}

function PopularKeywords() {
  const keywords = [
    "9999 win game download",
    "p999 apk pakistan",
    "5555bet game",
    "okpkr wingo",
    "done999 game",
    "color prediction Pakistan",
    "earning app JazzCash",
    "casino game APK 2026",
    "real money games Pakistan",
  ];

  return (
    <section>
      <h2 className="mb-4 font-heading text-lg font-bold text-muted-foreground">
        Popular Searches
      </h2>
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw) => (
          <span
            key={kw}
            className="cursor-default rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            {kw}
          </span>
        ))}
      </div>
    </section>
  );
}

async function InterlinksFooter() {
  const games = await getAllGames();

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-4 font-heading text-lg font-bold">
        Download all HotAPK Games APKs — Pakistan 2026
      </h2>
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
        {games.map((g) => (
          <Link
            key={g.slug}
            href={`/${g.slug}`}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
          >
            <CheckCircle className="h-4 w-4 text-green-500" />
            {g.title} – Download APK
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function HomePage() {
  return (
    <>
      <FAQSchema faqs={homeFAQs} pageUrl={absoluteUrl("/")} />
      <HomeReviewSchema />
      <HowToSchema />

      <section className="relative overflow-hidden border-b border-border bg-linear-to-b from-primary/5 to-transparent py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mx-auto max-w-3xl font-heading text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Pakistan&apos;s trusted{" "}
            <span className="text-primary">HotAPK Games</span>{" "}
            <span className="text-accent">reviews & downloads</span>
            <span className="mt-2 block text-xl font-semibold text-yellow-400 md:text-2xl">
              Verified Earning Game APKs & Downloads (2026)
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Independent APK reviews and safe install checklists for online earning games with EasyPaisa and JazzCash withdrawal notes—updated daily.
          </p>

          <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://jfmj417538-auguayhbendnbbbe.a02.azurefd.net/?dl=4hp7fx"
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-7 text-base font-bold text-white shadow-lg gradient-primary transition-all hover:scale-105 hover:opacity-95"
            >
              <Download className="h-5 w-5" />
              Download Official APK (2026)
            </a>
            <Link
              href="/games"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 text-base font-semibold text-foreground transition-all hover:bg-muted"
            >
              Browse All Games
            </Link>
          </div>

          <form action="/search" className="mx-auto mt-8 flex max-w-lg gap-2">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                placeholder="Search earning games, casino APKs..."
                className="h-12 rounded-xl border-border bg-card pl-10"
              />
            </div>
            <Button
              type="submit"
              className="h-12 rounded-xl px-6 text-white gradient-primary hover:opacity-95"
            >
              Search
            </Button>
          </form>

          <div className="mt-12">
            <Suspense
              fallback={<div className="h-20 animate-pulse rounded bg-muted" />}
            >
              <StatsSection />
            </Suspense>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl text-center">
          <BrandLogo size="lg" className="mx-auto mb-6" priority />
          <p className="leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">HotAPK Games</strong>
            {" "}
            is Pakistan&apos;s trusted directory for real-money earning game APKs in 2026. 
            We provide independent, malware-scanned downloads for color prediction, casino, lottery, and slots platforms. 
            Check verified install steps, mirror links, and EasyPaisa or JazzCash withdrawal timelines for every game before you play.
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href="https://jfmj417538-auguayhbendnbbbe.a02.azurefd.net/?dl=4hp7fx"
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-md gradient-primary transition-all hover:scale-105 hover:opacity-95"
            >
              <Download className="h-5 w-5" />
              Direct Official APK Download
            </a>
          </div>
        </section>

        <Suspense fallback={<GridSkeleton />}>
          <LatestSection />
        </Suspense>

        <Suspense fallback={<GridSkeleton />}>
          <FeaturedSection />
        </Suspense>

        <HowToDownload />

        <Suspense fallback={<GridSkeleton />}>
          <CasinoSection />
        </Suspense>

        <WhyChooseUs />

        <GeneralGuidesSection />

        <SiteReviewsSection />

        <InterlinksFooter />

        <section>
          <h2 className="mb-6 font-heading text-2xl font-bold">
            Frequently Asked Questions – Earning Games Pakistan
          </h2>
          <div className="mx-auto max-w-3xl">
            <FAQAccordion items={homeFAQs} />
          </div>
        </section>

        <PopularKeywords />
      </div>
    </>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  );
}
