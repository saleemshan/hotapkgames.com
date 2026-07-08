"use client";

import { useMDXComponent } from "next-contentlayer2/hooks";

import { mdxDetailComponents } from "@/components/mdx/mdx-detail-components";
import { detailMdxClassName } from "@/lib/mdx-prose";

export function GuideMDX({ code }: { code: string }) {
  const MDXContent = useMDXComponent(code);
  return (
    <div className={detailMdxClassName}>
      <MDXContent components={mdxDetailComponents} />
    </div>
  );
}
