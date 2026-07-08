import type { Guide } from "contentlayer/generated";

import { JsonLd } from "./JsonLd";
import { SITE_LOGO } from "@/lib/site-media";
import { absoluteUrl, getOrgSameAs, siteConfig } from "@/lib/seo";
import { toPlainTextForSchema } from "@/lib/plain-text";

const GUIDE_CAT_LABEL: Record<Guide["category"], string> = {
  general: "General",
  "how-to": "How-to",
  reviews: "Reviews",
  news: "News",
};

export function GuideBlogPostingJsonLd({ guide }: { guide: Guide }) {
  const pageUrl = absoluteUrl(guide.url);
  const origin = absoluteUrl("/");
  const orgId = `${origin}#organization`;
  const websiteId = `${origin}#website`;
  const articleId = `${pageUrl}#blogposting`;
  const webpageId = `${pageUrl}#webpage`;

  const published = new Date(guide.publishedAt).toISOString();
  const modified = new Date(guide.updatedAt).toISOString();
  const cover = absoluteUrl(guide.coverImage);
  const logo = absoluteUrl(SITE_LOGO.src);
  const wordCount = guide.body.raw.split(/\s+/).filter(Boolean).length;
  const section = GUIDE_CAT_LABEL[guide.category];
  const sameAs = getOrgSameAs();

  const org: Record<string, unknown> = {
    "@type": "Organization",
    "@id": orgId,
    name: siteConfig.name,
    url: origin,
    logo: {
      "@type": "ImageObject",
      "@id": `${orgId}#logo`,
      url: logo,
      width: SITE_LOGO.width,
      height: SITE_LOGO.height,
    },
  };
  if (sameAs.length > 0) org.sameAs = sameAs;

  const posting: Record<string, unknown> = {
    "@type": "BlogPosting",
    "@id": articleId,
    headline: guide.title,
    name: guide.title,
    description: guide.excerpt || guide.description,
    image: {
      "@type": "ImageObject",
      url: cover,
      width: 1200,
      height: 630,
    },
    datePublished: published,
    dateModified: modified,
    author: {
      "@type": "Organization",
      name: guide.author,
    },
    publisher: { "@id": orgId },
    mainEntityOfPage: { "@id": webpageId },
    url: pageUrl,
    articleSection: section,
    inLanguage: "en-PK",
    wordCount,
    timeRequired: `PT${Math.max(1, guide.readingTime)}M`,
    isPartOf: { "@id": websiteId },
  };
  if (guide.tags.length) posting.keywords = guide.tags.join(", ");

  const hasFaq = guide.faqs.length > 0;

  const webDoc: Record<string, unknown> = hasFaq
    ? {
        "@type": "FAQPage",
        "@id": webpageId,
        url: pageUrl,
        name: guide.title,
        description: guide.description,
        isPartOf: { "@id": websiteId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: cover,
          width: 1200,
          height: 630,
        },
        datePublished: published,
        dateModified: modified,
        about: { "@id": articleId },
        mainEntity: guide.faqs.map((f) => ({
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
        name: guide.title,
        description: guide.description,
        isPartOf: { "@id": websiteId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: cover,
          width: 1200,
          height: 630,
        },
        datePublished: published,
        dateModified: modified,
      };

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      org,
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: siteConfig.name,
        url: origin,
        publisher: { "@id": orgId },
        inLanguage: "en-PK",
      },
      webDoc,
      posting,
    ],
  };

  return <JsonLd data={data} />;
}
