import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

const notionModuleUrl = new URL("../lib/seo/notion.ts", import.meta.url);
const metadataModuleUrl = new URL("../lib/seo/metadata.ts", import.meta.url);

const recordMapFixture = {
  block: {
    page: {
      value: {
        type: "page",
        created_time: 1_700_000_000_000,
        last_edited_time: 1_710_000_000_000,
        properties: { title: [["?꾩쟾??湲 ?쒕ぉ"]] },
      },
    },
    intro: {
      value: {
        value: {
          type: "text",
          properties: {
            title: [
              ["??臾몄꽌??"],
              ["Money Comics", [["b"], ["c"]]],
              [" ?꾨줈?앺듃??媛쒕컻 湲곕줉?낅땲??"],
            ],
          },
        },
      },
    },
  },
};

test("extracts every Notion rich-text fragment and real timestamps", async () => {
  assert.ok(existsSync(notionModuleUrl), "lib/seo/notion.ts should exist");
  const { extractNotionSeoDocument } = await import(notionModuleUrl.href);
  const result = extractNotionSeoDocument(recordMapFixture, {
    title: "Fallback title",
    description: "Fallback description",
  });

  assert.equal(result.title, "?꾩쟾??湲 ?쒕ぉ");
  assert.equal(
    result.description,
    "??臾몄꽌??Money Comics ?꾨줈?앺듃??媛쒕컻 湲곕줉?낅땲??",
  );
  assert.equal(result.bodyText, result.description);
  assert.equal(result.datePublished, "2023-11-14T22:13:20.000Z");
  assert.equal(result.dateModified, "2024-03-09T16:00:00.000Z");
});

test("uses deterministic fallbacks and omits invalid dates", async () => {
  assert.ok(existsSync(notionModuleUrl), "lib/seo/notion.ts should exist");
  const { extractNotionSeoDocument } = await import(notionModuleUrl.href);
  const result = extractNotionSeoDocument({ block: {} }, {
    title: "Fallback title",
    description: "Fallback description",
  });

  assert.deepEqual(result, {
    title: "Fallback title",
    description: "Fallback description",
    bodyText: "",
  });

  const invalidDates = extractNotionSeoDocument(
    {
      block: {
        page: {
          value: {
            type: "page",
            created_time: Number.NaN,
            last_edited_time: Number.POSITIVE_INFINITY,
          },
        },
      },
    },
    {
      title: "Fallback title",
      description: (title: string) => `Read more about ${title}.`,
    },
  );
  assert.deepEqual(invalidDates, {
    title: "Fallback title",
    description: "Read more about Fallback title.",
    bodyText: "",
  });
});

test("normalizes body whitespace and limits descriptions to 160 characters", async () => {
  assert.ok(existsSync(notionModuleUrl), "lib/seo/notion.ts should exist");
  const { extractNotionSeoDocument } = await import(notionModuleUrl.href);
  const longText = `  ${"a".repeat(100)}   ${"b".repeat(100)}  `;
  const result = extractNotionSeoDocument(
    {
      block: {
        page: {
          value: {
            type: "page",
            properties: { title: [["Long article"]] },
          },
        },
        intro: {
          value: {
            type: "text",
            properties: { title: [[longText]] },
          },
        },
      },
    },
    { title: "Fallback title", description: "Fallback description" },
  );

  assert.equal(result.bodyText, `${"a".repeat(100)} ${"b".repeat(100)}`);
  assert.equal(result.description.length, 160);
  assert.equal(result.description, result.bodyText.slice(0, 160));
});

test("builds canonical article metadata and safe BlogPosting JSON-LD", async () => {
  assert.ok(existsSync(metadataModuleUrl), "lib/seo/metadata.ts should exist");
  const {
    createRootMetadata,
    createPageMetadata,
    createBlogPostingJsonLd,
    serializeJsonLd,
  } = await import(metadataModuleUrl.href);
  const env = { NEXT_PUBLIC_SITE_URL: "https://example.com" };
  const document = {
    title: "<SEO article>",
    description: "Complete description",
    bodyText: "Complete description",
    datePublished: "2023-11-14T22:13:20.000Z",
    dateModified: "2024-03-09T16:00:00.000Z",
  };
  const metadata = createPageMetadata(
    {
      title: document.title,
      description: document.description,
      path: "/article/canonical-id",
      kind: "article",
      datePublished: document.datePublished,
      dateModified: document.dateModified,
    },
    env,
  );

  assert.equal(metadata.alternates?.canonical, "/article/canonical-id");
  assert.equal(metadata.openGraph?.url, "https://example.com/article/canonical-id");
  assert.equal(metadata.openGraph?.type, "article");
  assert.equal(metadata.twitter?.card, "summary_large_image");

  const rootMetadata = createRootMetadata(env);
  assert.equal(rootMetadata.metadataBase?.toString(), "https://example.com/");
  assert.equal(rootMetadata.alternates?.canonical, "/");
  assert.equal(rootMetadata.openGraph?.url, "https://example.com/");

  const jsonLd = createBlogPostingJsonLd(
    { document, path: "/article/canonical-id" },
    env,
  );
  assert.equal(jsonLd.url, "https://example.com/article/canonical-id");
  assert.equal(
    jsonLd.mainEntityOfPage["@id"],
    "https://example.com/article/canonical-id",
  );
  assert.equal(jsonLd.image, "https://example.com/opengraph-image");
  assert.equal(jsonLd.author.url, "https://example.com/about");
  assert.doesNotMatch(serializeJsonLd(jsonLd), /</);
  assert.match(serializeJsonLd(jsonLd), /\\u003cSEO article>/);
});
