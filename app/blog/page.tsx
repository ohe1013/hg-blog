import { NotionAPI } from "notion-client";
import BlogSSRWrapper from "./BlogSSRWrapper";
import { rootDir } from "@features/notion/data";

import { Metadata } from "next";

export const revalidate = 3600; // 1 hour

export const metadata: Metadata = {
  title: "HG Blog",
  description: "HG's Tech Blog - React, Next.js, and more.",
};

export default async function BlogPage() {
  const notion = new NotionAPI();
  try {
    const recordMap = await notion.getPage(rootDir.blog);
    return <BlogSSRWrapper recordMap={recordMap} pageId={rootDir.blog} />;
  } catch (error: any) {
    console.error("Failed to fetch blog page:", error);
    return (
      <div style={{ padding: 20, color: "red" }}>
        <h1>Error loading blog</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
        <p>{error?.message}</p>
      </div>
    );
  }
}
