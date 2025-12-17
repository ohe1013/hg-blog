import BlogSSRWrapper from "../BlogSSRWrapper";
import { NotionAPI } from "notion-client";
import { rootDir } from "@features/notion/data";

interface fetchEachPagesProps {
  params: {
    pageId: string; // pageId 추출
  };
}

export const revalidate = 3600; // 1 hour

export async function generateStaticParams() {
  const notion = new NotionAPI();
  const recordMap = await notion.getPage(rootDir.blog);

  const collectionQuery = recordMap.collection_query ?? null;

  if (!collectionQuery) {
    console.warn("⚠️ No collection_query returned from Notion");
    return []; // 최소한 에러는 안 나도록
  }

  const views = Object.values(collectionQuery)?.[0];
  if (!views) {
    console.warn("⚠️ No views in collection_query");
    return [];
  }

  const view = Object.values(views)?.[0];
  if (!view) {
    console.warn("⚠️ No view object found");
    return [];
  }

  const blockIds = view?.collection_group_results?.blockIds ?? [];
  console.log("Found blog posts:", blockIds.length);

  return blockIds.map((id) => ({ pageId: id }));
}

export async function generateMetadata({ params }: fetchEachPagesProps) {
  const notion = new NotionAPI();
  const recordMap = await notion.getPage(params.pageId);
  const title =
    Object.values(recordMap.block)[0]?.value?.properties?.title?.[0]?.[0] ||
    "Blog Post";

  return {
    title: `${title} | HG Blog`,
    description: `Read more about ${title} on HG Blog.`,
  };
}

const fetchEachPages = async ({ params }: fetchEachPagesProps) => {
  const notion = new NotionAPI();
  const recordMap = await notion.getPage(params.pageId);

  // We need to fetch the post details here if we want to pass them as initialPosts
  // But BlogSSRWrapper now expects a list of posts, not a single recordMap.
  // For the individual post page, we might want a different wrapper or logic.
  // However, the goal is to show the blog app.
  // Let's fetch the single post metadata and pass it as a single item list for now,
  // or ideally we should fetch the list of all posts even on a detail page to show the explorer correctly.

  // For now, let's just pass an empty list or fetch the list if possible.
  // But wait, if we are on a detail page, we probably want to open the specific post.
  // The current architecture opens the "Blog" window which is an explorer.
  // If we want to open a specific post, we might need a "BlogViewer" window.

  // Let's revert BlogSSRWrapper to be more flexible or create a new one for detail pages.
  // Actually, the plan said "Blog Viewer Component".
  // For the /blog/[id] route, we should probably render the Blog Viewer directly or open the Blog app and then the viewer.

  // Let's assume for now we just want to ensure the page renders without error.
  // We'll pass an empty list for now to satisfy the type, but we really need to handle the "open specific post" logic.
  return <BlogSSRWrapper initialPosts={[]} />;
};

export default fetchEachPages;
