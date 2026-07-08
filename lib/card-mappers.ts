import type { App, Game } from "contentlayer/generated";

import type { AppCardModel } from "@/components/listing/AppCard";
import { getPrimaryDownloadUrl } from "@/lib/download-links";
import { formatFileSizeDisplay } from "@/lib/format-file-size";

export function appToCardModel(a: App): AppCardModel {
  return {
    title: a.title,
    href: a.url,
    coverImage: a.coverImage,
    version: a.version,
    publishedAt: a.publishedAt,
    updatedAt: a.updatedAt,
    category: a.category,
    rating: a.rating,
    votes: a.votes,
    isNew: a.isNew,
    featured: a.featured,
    shortDescription: a.shortDescription,
    size: formatFileSizeDisplay(a.size),
    downloads: a.downloads,
    directDownloadUrl: getPrimaryDownloadUrl(a.downloadLinks),
  };
}

export function gameToCardModel(g: Game): AppCardModel {
  return {
    title: g.title,
    href: g.url,
    coverImage: g.coverImage,
    version: g.version,
    publishedAt: g.publishedAt,
    updatedAt: g.updatedAt,
    category: g.category,
    rating: g.rating,
    votes: g.votes,
    isNew: g.isNew,
    featured: g.featured,
    shortDescription: g.shortDescription,
    size: formatFileSizeDisplay(g.size),
    downloads: g.downloads,
    directDownloadUrl: getPrimaryDownloadUrl(g.downloadLinks),
  };
}
