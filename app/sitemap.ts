import { MetadataRoute } from "next";
import { getArticlePosts } from "@features/notion/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 3600;

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:5170";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const routes = ["", "/article"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  const posts = await getArticlePosts();
  const articleRoutes = posts.map((post) => ({
    url: `${baseUrl}/article/${post.pageId}`,
    lastModified: new Date(post.createdTime),
  }));

  return [...routes, ...articleRoutes];
}
