"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { cn } from "@/lib/utils";

export interface GuideTocItem {
  id: string;
  text: string;
  level: number;
}

const SCROLL_OFFSET_PX = 116;

function useActiveSectionIds(ids: string[]): string {
  const [activeId, setActiveId] = useState<string>(() => ids[0] ?? "");

  useEffect(() => {
    if (ids.length === 0) return;

    const update = () => {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= SCROLL_OFFSET_PX) current = id;
      }
      setActiveId(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ids]);

  return activeId;
}

type GuideTocContextValue = {
  items: GuideTocItem[];
  activeId: string;
  scrollToId: (id: string) => void;
};

const GuideTocContext = createContext<GuideTocContextValue | null>(null);

function useGuideToc() {
  const v = useContext(GuideTocContext);
  if (!v) throw new Error("GuideToc components must be inside GuideTocProvider");
  return v;
}

export function GuideTocProvider({
  items,
  extraItems = [],
  children,
}: {
  items: GuideTocItem[];
  extraItems?: GuideTocItem[];
  children: React.ReactNode;
}) {
  const allItems = useMemo(() => [...items, ...extraItems], [items, extraItems]);
  const ids = useMemo(() => allItems.map((i) => i.id), [allItems]);
  const activeId = useActiveSectionIds(ids);

  const scrollToId = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const value = useMemo(
    () => ({ items: allItems, activeId, scrollToId }),
    [allItems, activeId, scrollToId],
  );

  if (allItems.length === 0) return <>{children}</>;

  return (
    <GuideTocContext.Provider value={value}>{children}</GuideTocContext.Provider>
  );
}

function TocHeading() {
  return (
    <div className="mb-4 border-border border-b pb-3">
      <p className="font-heading text-[0.68rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">
        In this article
      </p>
      <p className="mt-1 text-xs text-muted-foreground/90 leading-snug">
        Jump to a section — order matches the guide below.
      </p>
    </div>
  );
}

function TocList({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const { items, activeId, scrollToId } = useGuideToc();

  return (
    <ul
      className={cn(
        "border-border/70 space-y-1 border-l-2 pl-3 md:pl-4",
        className,
      )}
    >
      {items.map((item, index) => {
        const isActive = activeId === item.id;
        const depth = Math.max(0, item.level - 2);
        return (
          <li
            key={`${item.id}::${index}`}
            className="relative"
            style={{ paddingLeft: depth * 14 }}
          >
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(item.id);
                onNavigate?.();
              }}
              className={cn(
                "block rounded-r-md py-2 pr-2 pl-3 text-left text-sm leading-snug transition-colors",
                item.level >= 4 && "text-[0.8125rem] text-muted-foreground",
                item.level === 3 && "text-muted-foreground",
                item.level === 2 && "font-semibold text-foreground",
                isActive
                  ? "bg-primary/9 text-purple-700 dark:text-purple-400 border-purple-700 dark:border-purple-400 border-l-[3px] font-semibold shadow-sm"
                  : "text-foreground/90 border-l-[3px] border-transparent hover:bg-muted/50 hover:text-purple-700 dark:text-purple-400",
              )}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** Always-visible TOC — mirrors the desktop rail so mobile users see sections without expanding */
export function GuideTocMobile() {
  const ctx = useContext(GuideTocContext);
  if (!ctx?.items.length) return null;

  return (
    <div className="lg:hidden">
      <nav
        className="border-border bg-card/90 ring-border/40 max-h-[min(60vh,28rem)] w-full overflow-y-auto overscroll-contain rounded-2xl border p-3 shadow-md ring-1 backdrop-blur-md sm:p-4"
        aria-label="Table of contents"
      >
        <TocHeading />
        <TocList />
      </nav>
    </div>
  );
}

/** Sticky rail — place in the right-hand grid column on large screens */
export function GuideTocRail() {
  const ctx = useContext(GuideTocContext);
  if (!ctx?.items.length) return null;

  return (
    <aside className="hidden lg:block">
      <nav
        className="border-border bg-card/90 sticky top-24 w-full max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain rounded-2xl border p-6 shadow-md ring-1 ring-border/40 backdrop-blur-md"
        aria-label="Table of contents"
      >
        <TocHeading />
        <TocList />
      </nav>
    </aside>
  );
}
