import { getArticlePosts } from "@features/notion/api";
import ArticleStateInitializer from "./ArticleStateInitializer";
import { Metadata } from "next";
import Link from "next/link";

export const revalidate = 3600; // 1 hour

export const metadata: Metadata = {
  title: "HG Articles",
  description: "HG's Tech Articles",
};

export default async function ArticlePage() {
  const posts = await getArticlePosts();

  return (
    <>
      <div className="sr-only">
        <h1>HG Articles</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.pageId}>
              <Link href={`/article/${post.pageId}`}>{post.title}</Link>
              <time dateTime={new Date(post.createdTime).toISOString()}>
                {new Date(post.createdTime).toLocaleDateString()}
              </time>
            </li>
          ))}
        </ul>
      </div>
      <ArticleStateInitializer initialPosts={posts} />
    </>
  );
}
