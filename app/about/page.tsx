import { getAboutPosts } from "@features/notion/api";
import AboutStateInitializer from "./AboutStateInitializer";
import { Metadata } from "next";
import Link from "next/link";

export const revalidate = 3600; // 1 hour

export const metadata: Metadata = {
  title: "HG About",
  description: "HG's About",
};

export default async function AboutPage() {
  const posts = await getAboutPosts();
  return (
    <>
      <div className="sr-only">
        <h1>HG About</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.pageId}>
              <Link href={`/about/${post.pageId}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </div>
      <AboutStateInitializer initialPosts={posts} />
    </>
  );
}
