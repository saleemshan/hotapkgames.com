import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AppDescription } from "@/components/detail/AppDescription";
import { DetailPageOutline } from "@/components/detail/DetailPageOutline";
import { DownloadMirrorLinks } from "@/components/detail/DownloadMirrorLinks";
import { FAQSection } from "@/components/detail/FAQSection";
import { TagList } from "@/components/detail/TagList";
import { GameHero } from "@/components/game/GameHero";
import { DownloadButton } from "@/components/game/DownloadButton";
import { RelatedGames } from "@/components/game/RelatedGames";
import { ReportModal } from "@/components/game/ReportModal";
import { ReviewForm } from "@/components/game/ReviewForm";
import { UserReviews } from "@/components/game/UserReviews";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { GameCard } from "@/components/game/GameCard";
import { GamePageJsonLd } from "@/components/seo/GamePageJsonLd";
import {
  contentGameToEarningGame,
  getMostViewed,
  getRelatedGamesByTags,
  getTopRated,
  type Game as EarningGame,
} from "@/lib/games";

import {
  getAllGames,
  getGameBySlug,
  getRelatedGames,
} from "@/lib/content";
import { getPrimaryDownloadUrl } from "@/lib/download-links";
import { resolveGameDetailExtras } from "@/lib/game-detail-extras";
import { getReviewsForGame } from "@/lib/reviews";
import { formatPkDate } from "@/lib/utils";
import {
  absoluteUrl,
  buildGameMetaDescription,
  buildGameMetaTitle,
  getCategoryLabel,
} from "@/lib/seo";

export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllGames().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) return { title: "Not found" };
  const path = game.url;
  const title = buildGameMetaTitle(game);
  const description = buildGameMetaDescription(game);
  const ogImage = absoluteUrl(
    `/api/og?title=${encodeURIComponent(game.title)}&rating=${game.rating}`,
  );
  return {
    title,
    description,
    alternates: { canonical: game.canonical || absoluteUrl(path) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

async function SidebarGames() {
  const [topRated, mostViewed] = await Promise.all([
    getTopRated(5),
    getMostViewed(5),
  ]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Top Rated
        </h3>
        <div className="space-y-2">
          {topRated.map((g) => (
            <GameCard key={g.slug} game={g} compact />
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Most Downloaded
        </h3>
        <div className="space-y-2">
          {mostViewed.map((g) => (
            <GameCard key={g.slug} game={g} compact />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function RootGameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();

  const extras = resolveGameDetailExtras(game);
  const earningGame = contentGameToEarningGame(game);
  earningGame.version = extras.displayVersion;
  earningGame.fileSize = extras.displaySize;
  const downloadHref = getPrimaryDownloadUrl(game.downloadLinks);

  let relatedEarning: EarningGame[] = await getRelatedGamesByTags(
    game.tags,
    slug,
    6,
  );
  if (relatedEarning.length === 0) {
    relatedEarning = getRelatedGames(game).map(contentGameToEarningGame);
  }

  const reviews = getReviewsForGame(slug);
  const categoryLabel = getCategoryLabel(earningGame.category);

  return (
    <>
      <GamePageJsonLd
        title={game.title}
        shortDescription={game.shortDescription}
        longDescription={game.description}
        slugPath={game.url}
        coverImage={game.coverImage}
        screenshots={game.screenshots}
        rating={game.rating}
        votes={game.votes}
        softwareVersion={extras.displayVersion}
        fileSize={extras.displaySize}
        datePublished={game.publishedAt}
        dateModified={game.updatedAt}
        tags={game.tags}
        categoryKey={earningGame.category}
        categoryLabel={categoryLabel}
        faqs={game.faqs}
        reviews={reviews}
        installSteps={extras.installSteps}
        downloadUrl={downloadHref}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { name: categoryLabel, href: `/category/${earningGame.category}` },
            { name: game.title, href: game.url },
          ]}
        />

        <GameHero game={earningGame} />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0 space-y-10">
            <article id="review" className="min-w-0 scroll-mt-28">
              <AppDescription raw={game.body.raw} contentFileId={game._id} />
            </article>

            <section id="reviews" className="scroll-mt-28 space-y-8">
              <ReviewForm gameSlug={slug} gameTitle={game.title} />
              <UserReviews reviews={reviews} gameName={game.title} />
            </section>

            <div>
              <ReportModal gameName={game.title} />
            </div>

            <section className="mt-10 space-y-3">
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Tags
              </h2>
              <TagList tags={game.tags} />
            </section>

            <div className="mt-10">
              <FAQSection faqs={game.faqs} />
            </div>

            <section id="download" className="scroll-mt-28 space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Download
              </h2>
              <p className="text-sm text-muted-foreground">
                Updated {formatPkDate(game.updatedAt)} · verify file size (
                {extras.displaySize}) after download.
              </p>
              <DownloadMirrorLinks links={game.downloadLinks} />
            </section>

            <RelatedGames games={relatedEarning} />
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-6">
              <DetailPageOutline
                hasReviews
                hasProsCons={false}
                hasRequirements={false}
                hasVersionHistory={false}
                hasInstall={false}
                hasScreenshots={false}
                hasFaq={game.faqs.length > 0}
                hasDownload={game.downloadLinks.length > 0}
              />
              <Suspense
                fallback={
                  <div className="h-64 animate-pulse rounded-xl bg-muted" />
                }
              >
                <SidebarGames />
              </Suspense>
            </div>
          </aside>
        </div>
      </div>

      {downloadHref ? (
        <DownloadButton url={downloadHref} gameName={game.title} sticky />
      ) : null}
    </>
  );
}
