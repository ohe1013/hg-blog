import type { Metadata } from "next";
import { getArticlePosts } from "@features/notion/api";
import { loadCanonicalNotionPage } from "@lib/server/contentRoute";
import {
  createBlogPostingJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from "@lib/seo/metadata";
import ArticleViewerStateInitializer from "./ArticleViewerStateInitializer";

type Props = { params: Promise<{ pageId: string }> };
export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getArticlePosts()).map((post) => ({ pageId: post.pageId }));
}

async function loadArticle(requestedPageId: string) {
  const posts = await getArticlePosts();
  const page = await loadCanonicalNotionPage({
    requestedPageId,
    entries: posts,
    basePath: "/article",
    fallbacks: {
      title: "Article Post",
      description: (title) => `Read more about ${title} on HG Article.`,
    },
  });
  return { posts, ...page };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pageId: requestedPageId } = await params;
  const { pageId, seo } = await loadArticle(requestedPageId);
  return createPageMetadata({
    title: seo.title,
    description: seo.description,
    path: `/article/${pageId}`,
    kind: "article",
    datePublished: seo.datePublished,
    dateModified: seo.dateModified,
  });
}

export default async function ArticlePage({ params }: Props) {
  const { pageId: requestedPageId } = await params;
  const { pageId, recordMap, seo, posts } = await loadArticle(requestedPageId);
  const jsonLd = createBlogPostingJsonLd({
    document: seo,
    path: `/article/${pageId}`,
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
      <ArticleViewerStateInitializer
        pageId={pageId}
        initialPosts={posts}
        initialRecordMap={recordMap}
      />
    </>
  );
}
