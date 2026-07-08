import { JsonLd } from "./JsonLd";
import { BASE_URL } from "@/lib/seo";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          ...(item.href
            ? { item: `${BASE_URL}${item.href.startsWith("/") ? item.href : `/${item.href}`}` }
            : {}),
        })),
      }}
    />
  );
}
