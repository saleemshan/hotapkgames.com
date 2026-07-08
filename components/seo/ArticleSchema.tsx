import { JsonLd } from "./JsonLd";
import { BASE_URL, SITE_NAME } from "@/lib/seo";

interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified: string;
}

export function ArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
}: ArticleSchemaProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        url: `${BASE_URL}${url}`,
        image: image ? (image.startsWith("http") ? image : `${BASE_URL}${image}`) : undefined,
        datePublished,
        dateModified,
        author: {
          "@type": "Organization",
          name: SITE_NAME,
          url: BASE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: BASE_URL,
        },
      }}
    />
  );
}
