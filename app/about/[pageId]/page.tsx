import { NotionAPI } from "notion-client";
import { getAboutPosts } from "@features/notion/api";
import AboutViewerStateInitializer from "./AboutViewerStateInitializer";

interface fetchEachPagesProps {
  params: Promise<{
    pageId: string;
  }>;
}

export const revalidate = 3600; // 1 hour

type NotionBlockLike = {
  type?: string;
  properties?: {
    title?: string[][];
  };
  created_time?: number;
};

function unwrapBlock(entry: unknown): NotionBlockLike | null {
  if (!entry || typeof entry !== "object") return null;
  const value = (entry as { value?: unknown }).value;
  if (!value || typeof value !== "object") return null;

  if ("type" in value) {
    return value as NotionBlockLike;
  }

  const nested = (value as { value?: unknown }).value;
  if (nested && typeof nested === "object" && "type" in nested) {
    return nested as NotionBlockLike;
  }

  return null;
}

export async function generateStaticParams() {
  const posts = await getAboutPosts();
  return posts.map((post) => ({ pageId: post.pageId }));
}

export async function generateMetadata({ params }: fetchEachPagesProps) {
  const { pageId } = await params;
  const notion = new NotionAPI();
  const recordMap = await notion.getPage(pageId);
  const blocks = Object.values(recordMap.block)
    .map(unwrapBlock)
    .filter((block): block is NotionBlockLike => Boolean(block));
  const title = blocks[0]?.properties?.title?.[0]?.[0] || "About Post";

  // Attempt to extract a summary or use a default one
  const introText = blocks
    .filter((b) => b.type === "text")
    .slice(0, 3)
    .map((b) => b.properties?.title?.[0]?.[0])
    .filter(Boolean)
    .join(" ")
    .slice(0, 160);

  const description = introText || `Read more about ${title} on HG About.`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: title,
      description: description,
    },
  };
}

const fetchEachPages = async ({ params }: fetchEachPagesProps) => {
  const { pageId } = await params;
  const notion = new NotionAPI();
  console.log("pageId", pageId);
  // Fetch both the specific post and the list of all posts
  const [recordMap, allPosts] = await Promise.all([
    notion.getPage(pageId),
    getAboutPosts(),
  ]);
  const blocks = Object.values(recordMap.block)
    .map(unwrapBlock)
    .filter((block): block is NotionBlockLike => Boolean(block));
  const title = blocks[0]?.properties?.title?.[0]?.[0] || "About Post";

  // Simple text extraction for SEO (first few blocks)
  const introText = blocks
    .filter((b) => b.type === "text")
    .slice(0, 5)
    .map((b) => b.properties?.title?.[0]?.[0])
    .filter(Boolean)
    .filter(Boolean)
    .join(" ");

  const description = introText || `Read more about ${title} on HG About.`;
  const time = blocks[0]?.created_time;
  const datePublished = time ? new Date(time).toISOString() : "";
  return (
    <>
      {/* SEO Content: Hidden from visual users but visible to crawlers */}
      <div className="sr-only">
        <h1>{title}</h1>
        <article>
          {introText}
          <p>Read the full post in the about viewer window.</p>
        </article>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description: description,
            datePublished,
            author: {
              "@type": "Person",
              name: "HG",
            },
          }),
        }}
      />

      {/* Client-side logic to open the desktop windows */}
      <AboutViewerStateInitializer pageId={pageId} initialPosts={allPosts} />
    </>
  );
};

export default fetchEachPages;
