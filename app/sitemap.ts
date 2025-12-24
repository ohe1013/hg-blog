import { MetadataRoute } from "next";
import { getArticlePosts } from "@features/notion/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "http://localhost:5170"; // 배포 시 실제 도메인으로 변경 필요

  // 기본 페이지
  const routes = ["", "/article"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // 블로그 포스트 동적 생성
  const posts = await getArticlePosts();
  const articleRoutes = posts.map((post) => ({
    url: `${baseUrl}/article/${post.pageId}`,
    lastModified: new Date(post.createdTime).toISOString(),
  }));

  return [...routes, ...articleRoutes];
}
