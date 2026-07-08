import type { UserReview } from "@/components/game/UserReviews";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_LOGO } from "@/lib/site-media";
import {
  absoluteUrl,
  getOrgSameAs,
  getSiteUrl,
  siteConfig,
} from "@/lib/seo";
import { toPlainTextForSchema } from "@/lib/plain-text";

const MAX_SCREENSHOTS = 8;
const MAX_REVIEWS = 8;
const RATING_MAX = 5;
const RATING_MIN = 1;

function toIso(d: string | Date | undefined): string | undefined {
  if (d == null) return undefined;
  const t = new Date(d).getTime();
  if (!Number.isFinite(t)) return undefined;
  return new Date(t).toISOString();
}

function safeRating(n: number): number {
  const v = Number(n);
  if (!Number.isFinite(v)) return 4;
  return Math.min(RATING_MAX, Math.max(RATING_MIN, v));
}

type Faq = { question: string; answer: string };

type InstallStep = { title: string; description: string };

/**
 * One `application/ld+json` with `@graph` for game detail URLs — avoids duplicate
 * SoftwareApplication / Article / Product / FAQ blocks that confuse Rich Results / GSC.
 */
export function GamePageJsonLd({
  title,
  shortDescription,
  longDescription,
  slugPath,
  coverImage,
  screenshots,
  rating,
  votes,
  softwareVersion,
  fileSize,
  datePublished,
  dateModified,
  tags,
  categoryKey,
  categoryLabel,
  faqs,
  reviews,
  installSteps,
  downloadUrl,
}: {
  title: string;
  shortDescription: string;
  /** Falls back to shortDescription if empty — use meta description–length copy when available. */
  longDescription?: string;
  slugPath: string;
  coverImage?: string;
  screenshots?: string[];
  rating: number;
  votes: number;
  softwareVersion?: string;
  fileSize?: string;
  datePublished: string | Date;
  dateModified: string | Date;
  tags: string[];
  categoryKey: string;
  categoryLabel: string;
  faqs: Faq[];
  reviews: UserReview[];
  installSteps?: InstallStep[];
  downloadUrl?: string | null;
}) {
  const origin = getSiteUrl().replace(/\/$/, "");
  const pageUrl = absoluteUrl(slugPath);
  const appId = `${pageUrl}#app`;
  const webpageId = `${pageUrl}#webpage`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const orgId = `${origin}/#organization`;
  const websiteId = `${origin}/#website`;
  const howToId = `${pageUrl}#howto`;

  const desc =
    (longDescription?.trim() || shortDescription).trim() || title;
  const published = toIso(datePublished);
  const modified = toIso(dateModified);

  const shotUrls = (screenshots ?? [])
    .slice(0, MAX_SCREENSHOTS)
    .map((u) => absoluteUrl(u));

  const keywordParts = [
    ...tags,
    categoryKey.replace(/-/g, " "),
  ].map((s) => s.trim()).filter(Boolean);
  const keywords =
    keywordParts.length > 0 ? [...new Set(keywordParts)].join(", ") : undefined;

  const voteInt = Math.floor(Number(votes));
  const listingRating = safeRating(rating);
  const showAggregate =
    Number.isFinite(voteInt) && voteInt >= 1 && Number.isFinite(listingRating);

  // Reviews are nested under `MobileApplication.review`; do not set `itemReviewed`
  // (Google Search Console: nested parent + itemReviewed = directional conflict).
  const reviewNodes =
    reviews.length > 0
      ? reviews.slice(0, MAX_REVIEWS).map((r) => ({
          "@type": "Review" as const,
          author: {
            "@type": "Person" as const,
            name: r.name,
          },
          datePublished: r.date,
          reviewBody: r.comment,
          reviewRating: {
            "@type": "Rating" as const,
            ratingValue: safeRating(r.rating),
            bestRating: RATING_MAX,
            worstRating: RATING_MIN,
          },
        }))
      : [];

  const mobileApp: Record<string, unknown> = {
    "@type": "MobileApplication",
    "@id": appId,
    name: title,
    description: desc,
    url: pageUrl,
    operatingSystem: "Android",
    applicationCategory: "GameApplication",
    inLanguage: "en-PK",
    isPartOf: { "@id": websiteId },
    publisher: { "@id": orgId },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "PKR",
      availability: "https://schema.org/InStock",
    },
  };

  if (coverImage) {
    mobileApp.image = absoluteUrl(coverImage);
  }
  if (shotUrls.length) {
    mobileApp.screenshot = shotUrls.map((url) => ({
      "@type": "ImageObject",
      url,
    }));
  }
  if (softwareVersion?.trim()) {
    mobileApp.softwareVersion = softwareVersion.trim();
  }
  if (fileSize?.trim()) {
    mobileApp.fileSize = fileSize.trim();
  }
  if (published) mobileApp.datePublished = published;
  if (modified) mobileApp.dateModified = modified;
  if (keywords) mobileApp.keywords = keywords;
  // GSC FIX: Google requires `aggregateRating` whenever `review` is present.
  // Use listing rating/votes when available; fall back to computing from reviews.
  if (showAggregate) {
    mobileApp.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Math.round(listingRating * 10) / 10,
      ratingCount: Math.max(1, voteInt),
      bestRating: RATING_MAX,
      worstRating: RATING_MIN,
    };
  } else if (reviewNodes.length > 0) {
    // Compute aggregateRating from the review nodes themselves.
    const reviewRatings = reviewNodes.map(
      (r) => (r.reviewRating as { ratingValue: number }).ratingValue,
    );
    const avgRating =
      reviewRatings.reduce((sum, v) => sum + v, 0) / reviewRatings.length;
    mobileApp.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Math.round(avgRating * 10) / 10,
      ratingCount: reviewRatings.length,
      bestRating: RATING_MAX,
      worstRating: RATING_MIN,
    };
  }
  if (reviewNodes.length) {
    mobileApp.review = reviewNodes;
  }
  if (downloadUrl?.startsWith("http")) {
    mobileApp.downloadUrl = downloadUrl;
  }

  const breadcrumbItems = [
    { name: "Home", path: "/" as const },
    { name: categoryLabel, path: `/category/${categoryKey}` as const },
    { name: title, path: slugPath },
  ];

  const sameAs = getOrgSameAs();
  const org: Record<string, unknown> = {
    "@type": "Organization",
    "@id": orgId,
    name: siteConfig.name,
    url: origin,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(SITE_LOGO.src),
      width: SITE_LOGO.width,
      height: SITE_LOGO.height,
    },
  };
  if (sameAs.length) org.sameAs = sameAs;

  /**
   * GSC "Duplicate field FAQPage": do **not** emit both `WebPage` and `FAQPage` for the same URL.
   * `FAQPage` extends `WebPage` — use one node: `FAQPage` when FAQs exist (mainEntity = Questions,
   * `about` = app), else `WebPage` with mainEntity = app.
   */
  const pageDoc: Record<string, unknown> = faqs.length
    ? {
        "@type": "FAQPage",
        "@id": webpageId,
        url: pageUrl,
        name: title,
        description: desc,
        isPartOf: { "@id": websiteId },
        datePublished: published,
        dateModified: modified,
        inLanguage: "en-PK",
        breadcrumb: { "@id": breadcrumbId },
        about: { "@id": appId },
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: toPlainTextForSchema(f.question),
          acceptedAnswer: {
            "@type": "Answer",
            text: toPlainTextForSchema(f.answer),
          },
        })),
      }
    : {
        "@type": "WebPage",
        "@id": webpageId,
        url: pageUrl,
        name: title,
        description: desc,
        isPartOf: { "@id": websiteId },
        datePublished: published,
        dateModified: modified,
        inLanguage: "en-PK",
        mainEntity: { "@id": appId },
        breadcrumb: { "@id": breadcrumbId },
      };
  if (coverImage) {
    pageDoc.primaryImageOfPage = {
      "@type": "ImageObject",
      url: absoluteUrl(coverImage),
    };
  }

  const graph: Record<string, unknown>[] = [
    org,
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: siteConfig.name,
      url: origin,
      publisher: { "@id": orgId },
      inLanguage: "en-PK",
    },
    mobileApp,
    pageDoc,
    {
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: breadcrumbItems.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: absoluteUrl(item.path),
      })),
    },
  ];

  if (installSteps?.length) {
    graph.push({
      "@type": "HowTo",
      "@id": howToId,
      name: `How to download and install ${title} on Android`,
      totalTime: "PT5M",
      step: installSteps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.title,
        text: toPlainTextForSchema(s.description),
      })),
    });
  }

  const data = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return <JsonLd data={data} />;
}
