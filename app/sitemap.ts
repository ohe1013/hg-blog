import { MetadataRoute } from "next";
import { getAboutPosts, getArticlePosts } from "@features/notion/api";
import { getSiteBaseUrl } from "@features/notion/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteBaseUrl();

  const routes = ["", "/article", "/about"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  const articlePosts = await getArticlePosts();
  const aboutPosts = await getAboutPosts();
  const articleRoutes = articlePosts.map((post) => ({
    url: `${baseUrl}/article/${post.pageId}`,
  }));
  const aboutRoutes = aboutPosts.map((post) => ({
    url: `${baseUrl}/about/${post.pageId}`,
  }));

  return [...routes, ...articleRoutes, ...aboutRoutes];
}
