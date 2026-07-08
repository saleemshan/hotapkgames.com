"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items = [] }: FAQAccordionProps) {
  return (
    <Accordion multiple className="my-6">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`faq-${i}`} className="border-border">
          <AccordionTrigger className="text-left font-heading text-base hover:text-purple-700 dark:text-purple-400">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
