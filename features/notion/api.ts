import { NotionAPI } from "notion-client";
import { rootDir } from "./data";

export interface BlogPost {
  pageId: string;
  slug: string;
  title: string;
  createdTime: number;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const notion = new NotionAPI();
  try {
    const recordMap = await notion.getPage(rootDir.blog);
    const collectionQuery = recordMap.collection_query;
    if (!collectionQuery) return [];

    const views = Object.values(collectionQuery)[0];
    if (!views) return [];

    const view = Object.values(views)[0];
    const blockIds = view?.collection_group_results?.blockIds || [];
    const block = recordMap.block;

    return blockIds
      .map((blockId: string) => {
        const b = block[blockId]?.value;
        if (!b) return null;

        const title = b.properties?.title?.[0]?.[0] || "Untitled";
        return {
          pageId: blockId,
          slug: blockId, // Using blockId as slug for now
          title,
          createdTime: b.created_time,
        };
      })
      .filter((post): post is BlogPost => post !== null);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}
