import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppDescription } from "@/components/detail/AppDescription";
import { DetailPageOutline } from "@/components/detail/DetailPageOutline";
import { AppHero } from "@/components/detail/AppHero";
import { DownloadMirrorLinks } from "@/components/detail/DownloadMirrorLinks";
import { FAQSection } from "@/components/detail/FAQSection";
import { InstallSteps } from "@/components/detail/InstallSteps";
import { RelatedApps } from "@/components/detail/RelatedApps";
import { ScreenshotGallery } from "@/components/detail/ScreenshotGallery";
import { ShareButtons } from "@/components/detail/ShareButtons";
import { TagList } from "@/components/detail/TagList";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ListingSidebar } from "@/components/layout/ListingSidebar";
import { SoftwareApplicationJsonLd } from "@/components/seo/AppJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQPageJsonLd } from "@/components/seo/FAQPageJsonLd";
import { appToCardModel } from "@/lib/card-mappers";
import { getAllApps, getAppBySlug, getRelatedApps } from "@/lib/content";
import {
  absoluteUrl,
  buildAppMetaDescription,
  buildAppMetaTitle,
} from "@/lib/seo";
import { getPrimaryDownloadUrl } from "@/lib/download-links";
import { formatFileSizeDisplay } from "@/lib/format-file-size";
import { formatPkDate } from "@/lib/utils";

export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllApps().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  if (!app) return { title: "Not found" };
  const path = `/apps/${slug}`;
  const title = buildAppMetaTitle(app);
  const description = buildAppMetaDescription(app);
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(app.title)}&rating=${app.rating}`,
          width: 1200,
          height: 630,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  if (!app) notFound();

  const crumbs = [
    { name: "Apps", href: "/apps" },
    { name: app.title, href: app.url },
  ];

  const related = getRelatedApps(app).map(appToCardModel);
  const downloadHref = getPrimaryDownloadUrl(app.downloadLinks);
  const displaySize = formatFileSizeDisplay(app.size);

  const sectionTitle =
    "font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl";

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
      <article className="min-w-0 space-y-10">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", href: "/" },
            { name: "Apps", href: "/apps" },
            { name: app.title, href: app.url },
          ]}
        />
        <SoftwareApplicationJsonLd
          name={app.title}
          description={app.shortDescription}
          slugPath={app.url}
          rating={app.rating}
          votes={app.votes}
          kind="app"
          coverImage={app.coverImage}
          screenshots={app.screenshots}
          softwareVersion={app.version}
          fileSize={displaySize}
          datePublished={app.publishedAt}
          dateModified={app.updatedAt}
          tags={app.tags}
          categoryKey={app.category}
        />
        <FAQPageJsonLd faqs={app.faqs} />
        <Breadcrumb items={crumbs} />
        <AppHero
          title={app.title}
          coverImage={app.coverImage}
          shortDescription={app.shortDescription}
          rating={app.rating}
          votes={app.votes}
          downloadHref={downloadHref}
          downloads={app.downloads}
          size={displaySize}
          requirements={app.requirements}
          version={app.version}
          isNew={app.isNew}
        />
        <ShareButtons urlPath={app.url} title={app.title} floatingMobile />
        <section id="review" className="scroll-mt-28 space-y-3">
          <h2 className={sectionTitle}>Full review</h2>
          <p className="text-sm text-muted-foreground">
            Detailed write-up and tips from our listing—use the outline to jump around.
          </p>
          <AppDescription raw={app.body.raw} contentFileId={app._id} />
        </section>
        {app.screenshots.length > 0 ? (
          <section id="screenshots" className="scroll-mt-28 space-y-3">
            <h2 className={sectionTitle}>Screenshots</h2>
            <ScreenshotGallery urls={app.screenshots} productTitle={app.title} />
          </section>
        ) : null}
        <InstallSteps productTitle={app.title} steps={app.installSteps} />
        <section className="space-y-3">
          <h2 className={sectionTitle}>Tags</h2>
          <TagList tags={app.tags} />
        </section>
        <FAQSection faqs={app.faqs} />
        <section id="download" className="scroll-mt-28 space-y-4">
          <h2 className={sectionTitle}>Download</h2>
          <p className="text-sm text-muted-foreground">
            Updated {formatPkDate(app.updatedAt)} · verify file size ({displaySize}) after download.
          </p>
          <DownloadMirrorLinks links={app.downloadLinks} />
        </section>
        <RelatedApps items={related} />
      </article>
      <aside className="flex min-w-0 flex-col gap-6">
        <DetailPageOutline
          hasScreenshots={app.screenshots.length > 0}
          hasInstall={app.installSteps.length > 0}
          hasFaq={app.faqs.length > 0}
          hasDownload={app.downloadLinks.length > 0}
        />
        <ListingSidebar />
      </aside>
    </div>
  );
}
