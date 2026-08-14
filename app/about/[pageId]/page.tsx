import type { Metadata } from "next";
import { getAboutPosts } from "@features/notion/api";
import { loadCanonicalNotionPage } from "@lib/server/contentRoute";
import {
  createBlogPostingJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from "@lib/seo/metadata";
import AboutViewerStateInitializer from "./AboutViewerStateInitializer";

type Props = { params: Promise<{ pageId: string }> };
export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getAboutPosts()).map((post) => ({ pageId: post.pageId }));
}

async function loadAbout(requestedPageId: string) {
  const posts = await getAboutPosts();
  const page = await loadCanonicalNotionPage({
    requestedPageId,
    entries: posts,
    basePath: "/about",
    fallbacks: {
      title: "About Post",
      description: (title) => `Read more about ${title} on HG About.`,
    },
  });
  return { posts, ...page };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pageId: requestedPageId } = await params;
  const { pageId, seo } = await loadAbout(requestedPageId);
  return createPageMetadata({
    title: seo.title,
    description: seo.description,
    path: `/about/${pageId}`,
    kind: "article",
    datePublished: seo.datePublished,
    dateModified: seo.dateModified,
  });
}

export default async function AboutPage({ params }: Props) {
  const { pageId: requestedPageId } = await params;
  const { pageId, recordMap, seo, posts } = await loadAbout(requestedPageId);
  const jsonLd = createBlogPostingJsonLd({
    document: seo,
    path: `/about/${pageId}`,
  });

  return (
    <>
      <div className="sr-only">
        <h1>{seo.title}</h1>
        <article>{seo.description}</article>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <AboutViewerStateInitializer
        pageId={pageId}
        initialPosts={posts}
        initialRecordMap={recordMap}
      />
    </>
  );
}
