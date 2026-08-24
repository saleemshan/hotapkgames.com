import { DownloadButton } from "@/components/game/DownloadButton";

export function InArticleDownloadCta({
  href,
  gameName,
  caption = "Use the 786BET download button below. HotAPK Games does not store APKs.",
}: {
  href: string;
  gameName: string;
  caption?: string;
}) {
  return (
    <div className="not-prose my-8 rounded-2xl border border-accent/30 bg-accent-dim/20 p-4 sm:p-5 [&_a]:!text-white [&_a]:hover:!text-white [&_a]:hover:no-underline">
      <p className="mb-3 text-sm font-medium text-foreground">{caption}</p>
      <DownloadButton url={href} gameName={gameName} />
    </div>
  );
}
