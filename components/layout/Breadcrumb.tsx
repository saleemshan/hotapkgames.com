import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

interface BreadcrumbItem {
  name: string;
  /** Omit for the current page (renders as plain text). */
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const allItems = [{ name: "Home", href: "/" }, ...items];

  return (
    <>
      <BreadcrumbSchema items={allItems} />
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {allItems.map((item, i) => (
            <li
              key={`${item.name}-${item.href ?? "here"}-${i}`}
              className="flex items-center gap-1"
            >
              {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
              {i === allItems.length - 1 ? (
                <span className="font-medium text-foreground">{item.name}</span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="flex items-center gap-1 transition-colors hover:text-foreground"
                >
                  {i === 0 && <Home className="h-3.5 w-3.5" />}
                  {item.name}
                </Link>
              ) : (
                <span className="font-medium text-foreground">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
