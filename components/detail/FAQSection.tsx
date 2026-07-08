"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

export function FAQSection({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  if (!faqs.length) return null;

  const defaultOpen = faqs.map((_, i) => `faq-${i}`);

  return (
    <section id="faq" className="scroll-mt-24 space-y-4">
      <h2 className="font-heading text-xl font-bold text-foreground">FAQ</h2>
      <Accordion.Root
        type="multiple"
        defaultValue={defaultOpen}
        className="space-y-2"
      >
        {faqs.map((f, i) => (
          <Accordion.Item
            key={i}
            value={`faq-${i}`}
            className="overflow-hidden rounded-xl border border-border bg-card/70"
          >
            <Accordion.Header>
              <Accordion.Trigger className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left font-medium text-foreground hover:bg-muted [&[data-state=open]>svg]:rotate-180">
                {f.question}
                <ChevronDown className="size-4 shrink-0 text-accent transition-transform" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
              {f.answer}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
