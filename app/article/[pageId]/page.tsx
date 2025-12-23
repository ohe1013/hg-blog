import { NotionAPI } from "notion-client";
import { getArticlePosts } from "@features/notion/api";
import ArticleViewerStateInitializer from "./ArticleViewerStateInitializer";

interface fetchEachPagesProps {
  params: Promise<{
    pageId: string;
  }>;
}

export const revalidate = 3600; // 1 hour

export async function generateStaticParams() {
  const posts = await getArticlePosts();
  return posts.map((post) => ({ pageId: post.pageId }));
}

export async function generateMetadata({ params }: fetchEachPagesProps) {
  const { pageId } = await params;
  const notion = new NotionAPI();
  const recordMap = await notion.getPage(pageId);
  const title =
    Object.values(recordMap.block)[0]?.value?.properties?.title?.[0]?.[0] ||
    "Article Post";

  return {
    title: `${title} | HG Article`,
    description: `Read more about ${title} on HG Article.`,
  };
}

const fetchEachPages = async ({ params }: fetchEachPagesProps) => {
  const { pageId } = await params;
  console.log(pageId);
  const notion = new NotionAPI();

  // Fetch both the specific post and the list of all posts
  const [recordMap, allPosts] = await Promise.all([
    notion.getPage(pageId),
    getArticlePosts(),
  ]);

  const title =
    Object.values(recordMap.block)[0]?.value?.properties?.title?.[0]?.[0] ||
    "Article Post";

  // Simple text extraction for SEO (first few blocks)
  const blocks = Object.values(recordMap.block);
  const introText = blocks
    .filter((b) => b.value?.type === "text")
    .slice(0, 5)
    .map((b) => b.value?.properties?.title?.[0]?.[0])
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {/* SEO Content: Hidden from visual users but visible to crawlers */}
      <div className="sr-only">
        <h1>{title}</h1>
        <article>
          {introText}
          <p>Read the full post in the article viewer window.</p>
        </article>
      </div>

      {/* Client-side logic to open the desktop windows */}
      <ArticleViewerStateInitializer pageId={pageId} initialPosts={allPosts} />
    </>
  );
};

export default fetchEachPages;
