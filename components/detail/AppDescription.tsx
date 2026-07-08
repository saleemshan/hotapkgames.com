import path from "node:path";

import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { mdxDetailComponents } from "@/components/mdx/mdx-detail-components";
import { detailMdxClassName } from "@/lib/mdx-prose";
import { remarkStripEmbeddedFaq } from "@/lib/remark-strip-embedded-faq";
import { remarkStripEmbeddedProsCons } from "@/lib/remark-strip-embedded-pros-cons";

type AppDescriptionProps = {
  raw: string;
  /**
   * Contentlayer document `_id` (e.g. `games/foo.mdx`, `apps/bar.mdx`).
   * When set, MDX compiles with a real `VFile` path so remark plugins match,
   * and we enable GFM tables + the same strip rules as `contentlayer.config.ts`.
   */
  contentFileId?: string;
};

/**
 * Renders MDX with GFM tables. Strips embedded FAQ / Pros+Cons blocks (layout renders those from YAML).
 * Manual `## Table of contents` is kept — sidebar outline is extra navigation, not a replacement.
 */
const detailRemarkPlugins = [
  remarkGfm,
  remarkStripEmbeddedProsCons,
  remarkStripEmbeddedFaq,
];

export async function AppDescription({ raw, contentFileId }: AppDescriptionProps) {
  const source =
    contentFileId != null && contentFileId.length > 0
      ? {
          value: raw,
          path: path.join(process.cwd(), "content", contentFileId),
        }
      : raw;

  const content = await MDXRemote({
    source,
    components: mdxDetailComponents,
    options: {
      mdxOptions: {
        remarkPlugins: detailRemarkPlugins,
      },
    },
  });

  return <div className={detailMdxClassName}>{content}</div>;
}
