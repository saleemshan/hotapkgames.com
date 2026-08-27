import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Image from "next/image";

function Table(
  props: ComponentPropsWithoutRef<"table"> & { children?: ReactNode },
) {
  const { children, className, ...rest } = props;
  return (
    <div
      className="mdx-table-wrap not-prose my-6 w-full min-w-0 overflow-x-auto"
      style={{ WebkitOverflowScrolling: "touch" }}
      role="region"
      aria-label="Scrollable table"
      tabIndex={0}
    >
      <table
        className={
          className ??
          "min-w-full border-collapse text-left text-sm text-muted-foreground"
        }
        {...rest}
      >
        {children}
      </table>
    </div>
  );
}

type MdxImgProps = {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  title?: string;
};

function MdxImg({ src, alt, width, height, title }: MdxImgProps) {
  if (!src) return null;
  const w = typeof width === "number" ? width : Number(width) || 1280;
  const h = typeof height === "number" ? height : Number(height) || 720;
  return (
    <Image
      src={src}
      alt={alt || title || ""}
      width={w}
      height={h}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 720px"
      style={{
        width: "100%",
        height: "auto",
        maxWidth: "100%",
        display: "block",
      }}
      loading="lazy"
    />
  );
}

function PhoneShot({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;
  return (
    <figure className="mdx-phone-shot">
      <Image
        src={src}
        alt={alt ?? ""}
        width={596}
        height={1024}
        sizes="(max-width: 640px) 42vw, 280px"
        className="mdx-phone-shot__img"
      />
    </figure>
  );
}

function PhoneShotRow({ children }: { children?: ReactNode }) {
  return <div className="mdx-phone-shot-row not-prose">{children}</div>;
}

export const mdxDetailComponents = {
  table: Table,
  img: MdxImg as MDXComponents["img"],
  DownloadCta: () => null,
  PhoneShot,
  PhoneShotRow,
} satisfies MDXComponents;
