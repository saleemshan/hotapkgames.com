import type { Guide } from "contentlayer/generated";

import { JsonLd } from "./JsonLd";
import { absoluteUrl, getOrgSameAs, siteConfig } from "@/lib/seo";

type Props = {
  guides: Guide[];
  /** Self-referencing path, e.g. `/guides` or `/guides?category=how-to` */
  canonicalPath: string;
  name: string;
  description: string;
};

export function GuidesCollectionJsonLd({
  guides,
  canonicalPath,
  name,
  description,
}: Props) {
  const pageUrl = absoluteUrl(canonicalPath);
  const origin = absoluteUrl("/");
  const websiteId = `${origin}#website`;
  const orgId = `${origin}#organization`;
  const collectionId = `${pageUrl}#collection`;
  const listId = `${pageUrl}#itemlist`;
  const sameAs = getOrgSameAs();

  const org: Record<string, unknown> = {
    "@type": "Organization",
    "@id": orgId,
    name: siteConfig.name,
    url: origin,
  };
  if (sameAs.length > 0) org.sameAs = sameAs;

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
      {
        "@type": "CollectionPage",
        "@id": collectionId,
        url: pageUrl,
        name,
        description,
        isPartOf: { "@id": websiteId },
        about: {
          "@type": "Thing",
          name: `${siteConfig.name} guides`,
        },
        mainEntity: { "@id": listId },
      },
      {
        "@type": "ItemList",
        "@id": listId,
        numberOfItems: guides.length,
        itemListElement: guides.map((g, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: g.title,
          url: absoluteUrl(g.url),
          item: {
            "@type": "BlogPosting",
            headline: g.title,
            url: absoluteUrl(g.url),
            image: absoluteUrl(g.coverImage),
            datePublished: new Date(g.publishedAt).toISOString(),
          },
        })),
      },
    ],
  };

  return <JsonLd data={data} />;
}
