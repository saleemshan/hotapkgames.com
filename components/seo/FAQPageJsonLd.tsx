import { JsonLd } from "@/components/seo/JsonLd";
import { toPlainTextForSchema } from "@/lib/plain-text";

export function FAQPageJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  if (!faqs.length) return null;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: toPlainTextForSchema(f.question),
          acceptedAnswer: {
            "@type": "Answer",
            text: toPlainTextForSchema(f.answer),
          },
        })),
      }}
    />
  );
}
