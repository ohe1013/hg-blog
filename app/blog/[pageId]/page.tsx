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

  return <BlogSSRWrapper recordMap={recordMap} pageId={params.pageId} />;
};

export default fetchEachPages;
