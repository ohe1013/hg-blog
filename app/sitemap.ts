import { MetadataRoute } from "next";
import { getArticlePosts } from "@features/notion/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    "http://localhost:5170";

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
