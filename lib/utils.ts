import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function slugifyTag(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatPkDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
