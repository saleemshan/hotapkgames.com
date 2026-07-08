import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { getAllGames, getGameBySlug, getGuideBySlug } from "@/lib/content";

export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllGames().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (game)
    return {
      alternates: { canonical: game.url },
    };

  const guide = getGuideBySlug(slug);
  if (guide)
    return {
      title: guide.title,
      description: guide.excerpt,
      alternates: { canonical: guide.url },
    };

  return { title: "Not found" };
}

export default async function LegacyGameDetailRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) {
    const guide = getGuideBySlug(slug);
    if (guide) redirect(guide.url);
    notFound();
  }
  redirect(game.url);
}
