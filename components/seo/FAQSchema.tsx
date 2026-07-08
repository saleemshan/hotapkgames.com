import { JsonLd } from "./JsonLd";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
  /** Canonical URL of the page this FAQ belongs to (recommended for FAQ rich results). */
  pageUrl?: string;
}

export function FAQSchema({ faqs, pageUrl }: FAQSchemaProps) {
  if (faqs.length === 0) return null;

  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  if (pageUrl) {
    node["@id"] = `${pageUrl.replace(/\/$/, "")}#faqpage`;
    node.url = pageUrl.replace(/\/$/, "") || pageUrl;
  }

  return <JsonLd data={node} />;
}
