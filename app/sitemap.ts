import { MetadataRoute } from "next";
import { NotionAPI } from "notion-client";
import { rootDir } from "@features/notion/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "http://localhost:5170"; // 배포 시 실제 도메인으로 변경 필요

  // 기본 페이지
  const routes = ["", "/blog"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // 블로그 포스트 동적 생성
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const notion = new NotionAPI();
    const recordMap = await notion.getPage(rootDir.blog);
    const collectionQuery = recordMap.collection_query;
    if (!collectionQuery) return routes;

    const views = Object.values(collectionQuery)[0];
    if (!views) return routes;

    const view = Object.values(views)[0];
    const blockIds = view?.collection_group_results?.blockIds || [];

    blogRoutes = blockIds.map((pageId: string) => ({
      url: `${baseUrl}/blog/${pageId}`,
      lastModified: new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Failed to generate blog sitemap:", error);
  }

  return [...routes, ...blogRoutes];
}
