import { JsonLd } from "./JsonLd";
import { SITE_NAME, BASE_URL } from "@/lib/seo";

export function WebsiteSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: BASE_URL,
        potentialAction: {
          "@type": "SearchAction",
          target: `${BASE_URL}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}
