import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GuideMDX } from "@/components/guides/GuideMDX";
import { FAQSection } from "@/components/detail/FAQSection";
import { ShareButtons } from "@/components/detail/ShareButtons";
import { UserReviews } from "@/components/game/UserReviews";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import {
  GuideTocMobile,
  GuideTocProvider,
  GuideTocRail,
} from "@/components/guides/GuideTableOfContents";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { GuideBlogPostingJsonLd } from "@/components/seo/GuideBlogPostingJsonLd";
import { getAllGuides, getGuideBySlug, getRelatedGuides } from "@/lib/content";
import { extractTocFromMarkdown } from "@/lib/guide-toc";
import { getSiteReviews } from "@/lib/reviews";
import { absoluteUrl, getMetadataYear } from "@/lib/seo";
import { formatPkDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Not found" };
  const path = `/guides/${slug}`;
  const y = getMetadataYear();
  const title = `${guide.title} (${y})`;
  const cover = absoluteUrl(guide.coverImage);
  return {
    title,
    description: guide.description,
    authors: [{ name: guide.author, url: absoluteUrl("/") }],
    alternates: { canonical: guide.canonical || absoluteUrl(path) },
    openGraph: {
      title,
      description: guide.description,
      url: absoluteUrl(path),
      images: [{ url: cover, width: 1200, height: 630 }],
      type: "article",
      publishedTime: new Date(guide.publishedAt).toISOString(),
      modifiedTime: new Date(guide.updatedAt).toISOString(),
      authors: [guide.author],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: guide.description,
      images: [cover],
    },
    robots: { index: true, follow: true },
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const related = getRelatedGuides(guide);
  const tocFromMdx = extractTocFromMarkdown(guide.body.raw, guide.slug);
  const tocExtras = [
    { id: "reviews", text: "User reviews", level: 2 },
    ...(guide.faqs.length ? [{ id: "faq", text: "FAQ", level: 2 }] : []),
    ...(related.length > 0
      ? [{ id: "related-articles", text: "Related articles", level: 2 }]
      : []),
  ];
  const reviews = getSiteReviews();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Guides", href: "/guides" },
          { name: guide.title, href: guide.url },
        ]}
      />
      <GuideBlogPostingJsonLd guide={guide} />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ name: "Guides", href: "/guides" }, { name: guide.title }]} />
        <GuideTocProvider
          items={tocFromMdx.map((t) => ({
            id: t.id,
            text: t.text,
            level: t.level,
          }))}
          extraItems={[...tocExtras]}
        >
          <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_290px] lg:items-start lg:gap-10">
            {/* ── Main content column ── */}
            <div className="min-w-0 space-y-8">
              {/* Cover image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border shadow-lg sm:aspect-[2/1] lg:aspect-[21/9]">
                <Image
                  src={guide.coverImage}
                  alt={`Cover image for "${guide.title}" — Pakistani gaming guide`}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, calc(100vw - 330px)"
                />
              </div>

              {/* Article header */}
              <header className="space-y-3">
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Published {formatPkDate(guide.publishedAt)} · Last updated{" "}
                  {formatPkDate(guide.updatedAt)} · {guide.readingTime} min read ·{" "}
                  {guide.author}
                </p>
                <h1 className="font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl md:text-4xl">
                  {guide.title}
                </h1>
                <p className="text-base text-muted-foreground sm:text-lg">{guide.excerpt}</p>
              </header>

              {/* Share buttons */}
              <ShareButtons urlPath={guide.url} title={guide.title} />

              {/* Mobile-only TOC (hidden on lg+) */}
              <GuideTocMobile />

              {/* Article body */}
              <article>
                <GuideMDX code={guide.body.code} />
              </article>

              {/* User reviews */}
              <section id="reviews" className="scroll-mt-28">
                <UserReviews reviews={reviews} gameName={guide.title} />
              </section>

              {/* FAQ */}
              <FAQSection faqs={guide.faqs} />

              {/* Related articles */}
              {related.length > 0 ? (
                <section id="related-articles" className="scroll-mt-28 space-y-3">
                  <h2 className="font-heading text-xl font-bold text-foreground">
                    Related articles
                  </h2>
                  <ul className="space-y-2">
                    {related.map((g) => (
                      <li key={g.slug}>
                        <Link
                          href={g.url}
                          className="text-primary underline-offset-2 hover:underline"
                        >
                          {g.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>

            {/* ── Desktop TOC sidebar ── */}
            <GuideTocRail />
          </div>
        </GuideTocProvider>
      </div>
    </>
  );
}
