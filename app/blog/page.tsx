import { getBlogPosts } from "@features/notion/api";
import BlogStateInitializer from "./BlogStateInitializer";
import { Metadata } from "next";
import Link from "next/link";

export const revalidate = 3600; // 1 hour

export const metadata: Metadata = {
  title: "HG Blog",
  description: "HG's Tech Blog - React, Next.js, and more.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <div className="sr-only">
        <h1>HG Blog Posts</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.pageId}>
              <Link href={`/blog/${post.pageId}`}>{post.title}</Link>
              <time dateTime={new Date(post.createdTime).toISOString()}>
                {new Date(post.createdTime).toLocaleDateString()}
              </time>
            </li>
          ))}
        </ul>
      </div>
      <BlogStateInitializer initialPosts={posts} />
    </>
  );
}
