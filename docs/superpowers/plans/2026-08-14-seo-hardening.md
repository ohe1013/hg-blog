# SEO Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish canonical, error-safe, metadata-complete SEO behavior for the Notion-backed blog while preserving the current Windows 98 UI and public sitemap URLs.

**Architecture:** Add small pure SEO modules for site identity, canonical Notion route resolution, record-map text/date extraction, metadata/JSON-LD generation, and sitemap construction. Dynamic routes adapt those tested functions to Next 16.3 `notFound()` and `permanentRedirect()`, while React `cache()` shares the Notion response between metadata and page rendering and the same record map hydrates the existing viewer window.

**Tech Stack:** Next.js 16.3 App Router, React 19.2, TypeScript 5.4, Node 22, pnpm 10.14, Node test runner through `tsx`, Notion `ExtendedRecordMap`, Next `ImageResponse`.

## Global Constraints

- Preserve the current Windows 98 desktop, window, and navigation visuals.
- Keep every URL currently emitted by `sitemap.xml` as the canonical public URL.
- Do not introduce a separate search-only blog or migrate articles to new slugs.
- Do not perform the larger server-rendered Zustand window-state redesign in this change.
- Preserve the Notion-backed authoring flow.
- Use `npx --yes pnpm@10.14.0` for install and verification because the lockfile was produced by pnpm 10.14 and pnpm 11 ignores `package.json#pnpm.overrides`.
- Follow the local Next 16.3 documentation in `node_modules/next/dist/docs/`; do not rely on pre-16 route or metadata conventions.

---

## File map

- Create `lib/seo/site.ts`: normalize the site origin and compose absolute URLs.
- Create `lib/seo/routes.ts`: resolve exact canonical Notion IDs, equivalent aliases, and unknown IDs.
- Create `lib/seo/notion.ts`: unwrap record-map blocks and extract complete title/body/date data.
- Create `lib/seo/metadata.ts`: construct root/page metadata and safe `BlogPosting` JSON-LD.
- Create `lib/seo/sitemap.ts`: construct deterministic sitemap entries from canonical registries and real timestamps.
- Create `lib/seo/socialCard.tsx`: render the shared Windows 98 social card.
- Create `lib/server/contentRoute.ts`: adapt pure route results to `notFound()`/`permanentRedirect()` and load Notion once.
- Create `features/notion/viewerState.ts`: expose the tested decision for whether a viewer page requires a fetch.
- Create `app/opengraph-image.tsx` and `app/twitter-image.tsx`: Next file-based image routes.
- Create `tests/seo-site-route.test.ts`, `tests/seo-notion-metadata.test.ts`, `tests/seo-content-flow.test.ts`, and `tests/seo-sitemap-social.test.ts`.
- Modify `lib/server/notion.ts`, root/list/detail routes, viewer initializers, `ArticleViewerWindow.tsx`, `features/notion/api.ts`, `app/sitemap.ts`, `app/robots.ts`, `.env.example`, and `package.json`.

---

### Task 1: Site identity and canonical route resolution

**Files:**
- Create: `lib/seo/site.ts`
- Create: `lib/seo/routes.ts`
- Create: `tests/seo-site-route.test.ts`
- Modify: `features/notion/data.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `getSiteUrl(env?: SiteUrlEnv): URL`, `getSiteBaseUrl(env?: SiteUrlEnv): string`, and `getAbsoluteUrl(path: string, env?: SiteUrlEnv): string`.
- Produces: `resolveCanonicalPageId(requestedPageId, entries): RouteResolution` where `RouteResolution` is `canonical`, `redirect`, or `not-found`.
- Later tasks consume the exact canonical `pageId` and normalized absolute URLs.

- [ ] **Step 1: Write the failing site and route tests**

Create `tests/seo-site-route.test.ts` with existence assertions before dynamic imports so RED is an assertion failure rather than a module-resolution error:

```ts
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

const siteModuleUrl = new URL("../lib/seo/site.ts", import.meta.url);
const routeModuleUrl = new URL("../lib/seo/routes.ts", import.meta.url);

test("normalizes explicit, Vercel, and local site origins", async () => {
  assert.ok(existsSync(siteModuleUrl), "lib/seo/site.ts should exist");
  const { getSiteBaseUrl, getAbsoluteUrl } = await import(siteModuleUrl.href);

  assert.equal(
    getSiteBaseUrl({ NEXT_PUBLIC_SITE_URL: "https://example.com/" }),
    "https://example.com",
  );
  assert.equal(
    getSiteBaseUrl({ VERCEL_PROJECT_PRODUCTION_URL: "hg-blog.vercel.app" }),
    "https://hg-blog.vercel.app",
  );
  assert.equal(getSiteBaseUrl({}), "http://localhost:5170");
  assert.equal(
    getAbsoluteUrl("/article/post", {
      VERCEL_PROJECT_PRODUCTION_URL: "hg-blog.vercel.app",
    }),
    "https://hg-blog.vercel.app/article/post",
  );
});

test("resolves exact IDs, UUID aliases, and unknown IDs", async () => {
  assert.ok(existsSync(routeModuleUrl), "lib/seo/routes.ts should exist");
  const { resolveCanonicalPageId } = await import(routeModuleUrl.href);
  const entries = [
    { pageId: "2f5145eb576b806db310ffae54659a96" },
    { pageId: "Vannila-to-Vue-279145eb576b8035b39bd83c7dac0830" },
    { pageId: undefined },
  ];

  assert.deepEqual(
    resolveCanonicalPageId("2f5145eb576b806db310ffae54659a96", entries),
    { kind: "canonical", pageId: "2f5145eb576b806db310ffae54659a96" },
  );
  assert.deepEqual(
    resolveCanonicalPageId("279145eb576b8035b39bd83c7dac0830", entries),
    {
      kind: "redirect",
      pageId: "Vannila-to-Vue-279145eb576b8035b39bd83c7dac0830",
    },
  );
  assert.deepEqual(
    resolveCanonicalPageId("279145EB-576B-8035-B39B-D83C7DAC0830", entries),
    {
      kind: "redirect",
      pageId: "Vannila-to-Vue-279145eb576b8035b39bd83c7dac0830",
    },
  );
  assert.deepEqual(resolveCanonicalPageId("not-a-real-page", entries), {
    kind: "not-found",
  });
});

```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
npx --yes pnpm@10.14.0 exec tsx --tsconfig tests/tsconfig.react-server.json --conditions=react-server --test tests/seo-site-route.test.ts
```

Expected: FAIL with `lib/seo/site.ts should exist` and
`lib/seo/routes.ts should exist`.

- [ ] **Step 3: Implement the site-origin helper**

Create `lib/seo/site.ts`:

```ts
export type SiteUrlEnv = Readonly<{
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
}>;

const LOCAL_SITE_URL = "http://localhost:5170";

function withProtocol(value: string): string {
  return /^[a-z][a-z\d+.-]*:\/\//i.test(value)
    ? value
    : `https://${value}`;
}

export function getSiteUrl(env: SiteUrlEnv = process.env): URL {
  const configured =
    env.NEXT_PUBLIC_SITE_URL ?? env.VERCEL_PROJECT_PRODUCTION_URL;
  return new URL(configured ? withProtocol(configured) : LOCAL_SITE_URL);
}

export function getSiteBaseUrl(env: SiteUrlEnv = process.env): string {
  return getSiteUrl(env).origin;
}

export function getAbsoluteUrl(
  path: string,
  env: SiteUrlEnv = process.env,
): string {
  return new URL(path, `${getSiteBaseUrl(env)}/`).toString();
}
```

Remove the duplicate `getSiteBaseUrl()` implementation from
`features/notion/data.ts` and re-export the tested helper to preserve existing
imports:

```ts
export { getSiteBaseUrl } from "@lib/seo/site";
```

- [ ] **Step 4: Implement canonical Notion route resolution**

Create `lib/seo/routes.ts`:

```ts
export type CanonicalContentEntry = { pageId?: string };

export type RouteResolution =
  | { kind: "canonical"; pageId: string }
  | { kind: "redirect"; pageId: string }
  | { kind: "not-found" };

const TERMINAL_NOTION_ID =
  /([0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

function normalizedTerminalNotionId(value: string): string | null {
  const match = value.match(TERMINAL_NOTION_ID);
  return match ? match[1].replaceAll("-", "").toLowerCase() : null;
}

export function resolveCanonicalPageId(
  requestedPageId: string,
  entries: readonly CanonicalContentEntry[],
): RouteResolution {
  const canonicalIds = entries.flatMap((entry) =>
    entry.pageId ? [entry.pageId] : [],
  );
  const exact = canonicalIds.find((pageId) => pageId === requestedPageId);
  if (exact) return { kind: "canonical", pageId: exact };

  const normalizedRequested = normalizedTerminalNotionId(requestedPageId);
  if (!normalizedRequested) return { kind: "not-found" };

  const aliasTarget = canonicalIds.find(
    (pageId) => normalizedTerminalNotionId(pageId) === normalizedRequested,
  );
  return aliasTarget
    ? { kind: "redirect", pageId: aliasTarget }
    : { kind: "not-found" };
}
```

- [ ] **Step 5: Add the SEO script and rerun GREEN**

Modify `package.json` scripts:

```json
{
  "scripts": {
    "test": "pnpm test:security && pnpm test:seo && pnpm test:notion",
    "test:seo": "pnpm exec tsx --tsconfig tests/tsconfig.react-server.json --conditions=react-server --test tests/seo-site-route.test.ts"
  }
}
```

Run the Task 1 command again. Expected: all three Task 1 tests PASS.

- [ ] **Step 6: Commit Task 1**

```powershell
git add package.json lib/seo/site.ts lib/seo/routes.ts features/notion/data.ts tests/seo-site-route.test.ts
git commit -m "feat: add canonical SEO route identity"
```

---

### Task 2: Notion SEO extraction, metadata, and safe JSON-LD

**Files:**
- Create: `lib/seo/notion.ts`
- Create: `lib/seo/metadata.ts`
- Create: `tests/seo-notion-metadata.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `getSiteUrl()` and `getAbsoluteUrl()` from Task 1.
- Produces: `extractNotionSeoDocument(recordMap, fallbacks): NotionSeoDocument`.
- Produces: `createRootMetadata()`, `createPageMetadata(input)`, `createBlogPostingJsonLd(input)`, and `serializeJsonLd(value)`.
- Detail pages and sitemap consume the extracted dates and complete description.

- [ ] **Step 1: Write failing record-map and metadata tests**

Create `tests/seo-notion-metadata.test.ts`. Use the same existence-before-import
pattern as Task 1, then assert complete fragment extraction, stable dates,
canonical metadata, and script-safe JSON:

```ts
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
        properties: { title: [["완전한 글 제목"]] },
      },
    },
    intro: {
      value: {
        value: {
          type: "text",
          properties: {
            title: [
              ["이 문서는 "],
              ["Money Comics", [["b"], ["c"]]],
              [" 프로젝트의 개발 기록입니다."],
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

  assert.equal(result.title, "완전한 글 제목");
  assert.equal(
    result.description,
    "이 문서는 Money Comics 프로젝트의 개발 기록입니다.",
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
      description: (title) => `Read more about ${title}.`,
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
```

- [ ] **Step 2: Run the Task 2 test and verify RED**

Run:

```powershell
npx --yes pnpm@10.14.0 exec tsx --tsconfig tests/tsconfig.react-server.json --conditions=react-server --test tests/seo-notion-metadata.test.ts
```

Expected: FAIL on the explicit missing `lib/seo/notion.ts` and
`lib/seo/metadata.ts` assertions.

- [ ] **Step 3: Implement complete Notion text/date extraction**

Create `lib/seo/notion.ts` with these exported types and functions:

```ts
export type NotionSeoDocument = {
  title: string;
  description: string;
  bodyText: string;
  datePublished?: string;
  dateModified?: string;
};

type NotionBlockLike = {
  type?: string;
  properties?: { title?: unknown };
  created_time?: number;
  last_edited_time?: number;
};

export type SeoFallbacks = {
  title: string;
  description: string | ((title: string) => string);
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function unwrapBlock(entry: unknown): NotionBlockLike | null {
  if (!isRecord(entry) || !isRecord(entry.value)) return null;
  const candidate =
    typeof entry.value.type === "string" ? entry.value : entry.value.value;
  if (!isRecord(candidate) || typeof candidate.type !== "string") return null;
  const properties = isRecord(candidate.properties)
    ? { title: candidate.properties.title }
    : undefined;
  return {
    type: candidate.type,
    ...(properties ? { properties } : {}),
    ...(typeof candidate.created_time === "number"
      ? { created_time: candidate.created_time }
      : {}),
    ...(typeof candidate.last_edited_time === "number"
      ? { last_edited_time: candidate.last_edited_time }
      : {}),
  };
}

export function notionRichTextToPlainText(property: unknown): string {
  if (!Array.isArray(property)) return "";
  return property
    .map((fragment) =>
      Array.isArray(fragment) && typeof fragment[0] === "string"
        ? fragment[0]
        : "",
    )
    .join("");
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function toIsoTimestamp(value: unknown): string | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function extractNotionSeoDocument(
  recordMap: unknown,
  fallbacks: SeoFallbacks,
): NotionSeoDocument {
  const blockRecord =
    isRecord(recordMap) && isRecord(recordMap.block) ? recordMap.block : {};
  const blocks = Object.values(blockRecord)
    .map(unwrapBlock)
    .filter((block): block is NotionBlockLike => Boolean(block));
  const root = blocks.find((block) => block.type === "page");
  const title = normalizeWhitespace(
    notionRichTextToPlainText(root?.properties?.title),
  );
  const bodyText = normalizeWhitespace(
    blocks
      .filter((block) => block !== root)
      .map((block) => notionRichTextToPlainText(block.properties?.title))
      .filter(Boolean)
      .join(" "),
  );
  const resolvedTitle = title || fallbacks.title;
  const fallbackDescription =
    typeof fallbacks.description === "function"
      ? fallbacks.description(resolvedTitle)
      : fallbacks.description;
  const datePublished = toIsoTimestamp(root?.created_time);
  const dateModified = toIsoTimestamp(root?.last_edited_time);

  return {
    title: resolvedTitle,
    description: bodyText.slice(0, 160) || fallbackDescription,
    bodyText,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
  };
}
```

- [ ] **Step 4: Implement shared metadata and JSON-LD construction**

Create `lib/seo/metadata.ts`:

```ts
import type { Metadata } from "next";
import type { NotionSeoDocument } from "./notion";
import {
  getAbsoluteUrl,
  getSiteUrl,
  type SiteUrlEnv,
} from "./site";

export const SITE_NAME = "HG Blog";
export const SITE_DESCRIPTION =
  "A Windows 98-style personal blog sharing development journey and thoughts.";

const ICON_URL = "https://win98icons.alexmeub.com/icons/png/msie1-0.png";

export function createRootMetadata(
  env: SiteUrlEnv = process.env,
): Metadata {
  return {
    metadataBase: getSiteUrl(env),
    title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
    description: SITE_DESCRIPTION,
    alternates: { canonical: "/" },
    icons: { icon: ICON_URL },
    openGraph: {
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: getAbsoluteUrl("/", env),
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
    },
    verification: {
      google: "NZkIQWgMM6RC0fCX1PcdfmNinajsC837Lsa3qXzFoeA",
    },
  };
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  kind?: "website" | "article";
  datePublished?: string;
  dateModified?: string;
};

export function createPageMetadata(
  input: PageMetadataInput,
  env: SiteUrlEnv = process.env,
): Metadata {
  const shared = {
    title: input.title,
    description: input.description,
    url: getAbsoluteUrl(input.path, env),
    siteName: SITE_NAME,
    locale: "ko_KR",
  };
  const openGraph =
    input.kind === "article"
      ? {
          ...shared,
          type: "article" as const,
          ...(input.datePublished
            ? { publishedTime: input.datePublished }
            : {}),
          ...(input.dateModified ? { modifiedTime: input.dateModified } : {}),
          authors: ["HG"],
        }
      : { ...shared, type: "website" as const };

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: input.path },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
    },
  };
}

export function createBlogPostingJsonLd(
  input: { document: NotionSeoDocument; path: string },
  env: SiteUrlEnv = process.env,
) {
  const url = getAbsoluteUrl(input.path, env);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.document.title,
    description: input.document.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: getAbsoluteUrl("/opengraph-image", env),
    author: {
      "@type": "Person",
      name: "HG",
      url: getAbsoluteUrl("/about", env),
    },
    ...(input.document.datePublished
      ? { datePublished: input.document.datePublished }
      : {}),
    ...(input.document.dateModified
      ? { dateModified: input.document.dateModified }
      : {}),
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
```

- [ ] **Step 5: Run Task 2 GREEN and the accumulated SEO suite**

Extend `test:seo` in `package.json` now that the second test file exists:

```json
"test:seo": "pnpm exec tsx --tsconfig tests/tsconfig.react-server.json --conditions=react-server --test tests/seo-site-route.test.ts tests/seo-notion-metadata.test.ts"
```

Run:

```powershell
npx --yes pnpm@10.14.0 test:seo
```

Expected: Task 1 and Task 2 tests PASS.

- [ ] **Step 6: Commit Task 2**

```powershell
git add package.json lib/seo/notion.ts lib/seo/metadata.ts tests/seo-notion-metadata.test.ts
git commit -m "feat: extract complete Notion SEO metadata"
```

---

### Task 3: Canonical detail routes and single-fetch viewer hydration

**Files:**
- Create: `lib/server/contentRoute.ts`
- Create: `features/notion/viewerState.ts`
- Create: `tests/seo-content-flow.test.ts`
- Modify: `lib/server/notion.ts`
- Modify: `features/notion/api.ts`
- Modify: `app/article/[pageId]/page.tsx`
- Modify: `app/about/[pageId]/page.tsx`
- Modify: `app/article/[pageId]/ArticleViewerStateInitializer.tsx`
- Modify: `app/about/[pageId]/AboutViewerStateInitializer.tsx`
- Modify: `features/article/components/ArticleViewerWindow.tsx`
- Modify: `app/article/page.tsx`
- Modify: `app/about/page.tsx`
- Modify: `package.json`

**Interfaces:**
- Consumes: Task 1 route resolution and Task 2 SEO extraction/metadata.
- Produces: `loadCanonicalNotionPage()` returning canonical ID, record map, and SEO document or throwing a Next redirect/404 interrupt.
- Produces: `shouldFetchNotionPage(activePageId, loadedPageId): boolean` and
  `createNotionViewerParams(pageId, initialRecordMap, rootUrl)`.
- The viewer initializer receives `initialRecordMap`; the viewer consumes it without a duplicate mount fetch.

- [ ] **Step 1: Write failing content-flow behavior tests before route edits**

Create `tests/seo-content-flow.test.ts` with these initial tests:

```ts
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

const viewerStateUrl = new URL(
  "../features/notion/viewerState.ts",
  import.meta.url,
);

test("viewer fetches only when the active page is not already loaded", async () => {
  assert.ok(
    existsSync(viewerStateUrl),
    "features/notion/viewerState.ts should exist",
  );
  const { shouldFetchNotionPage } = await import(viewerStateUrl.href);
  assert.equal(shouldFetchNotionPage(null, null), false);
  assert.equal(shouldFetchNotionPage("page-a", "page-a"), false);
  assert.equal(shouldFetchNotionPage("page-b", "page-a"), true);
});

test("builds route-correct viewer parameters with the initial record map", async () => {
  assert.ok(
    existsSync(viewerStateUrl),
    "features/notion/viewerState.ts should exist",
  );
  const { createNotionViewerParams } = await import(viewerStateUrl.href);
  const initialRecordMap = { block: { page: { value: { type: "page" } } } };

  assert.deepEqual(
    createNotionViewerParams("article-page", initialRecordMap, "article"),
    {
      pageId: "article-page",
      initialRecordMap,
      rootUrl: "article",
    },
  );
  assert.deepEqual(
    createNotionViewerParams("about-page", initialRecordMap, "about"),
    {
      pageId: "about-page",
      initialRecordMap,
      rootUrl: "about",
    },
  );
});

test("post registries do not invent current timestamps", async () => {
  const { getArticlePosts, getAboutPosts } = await import(
    new URL("../features/notion/api.ts", import.meta.url).href
  );
  for (const post of [...(await getArticlePosts()), ...(await getAboutPosts())]) {
    assert.equal("createdTime" in post, false);
  }
});
```

Extend `test:seo` in `package.json` before running RED so this behavior suite is
part of every subsequent focused run:

```json
"test:seo": "pnpm exec tsx --tsconfig tests/tsconfig.react-server.json --conditions=react-server --test tests/seo-site-route.test.ts tests/seo-notion-metadata.test.ts tests/seo-content-flow.test.ts"
```

- [ ] **Step 2: Run the application contract and verify RED**

Run:

```powershell
npx --yes pnpm@10.14.0 test:seo
```

Expected: FAIL because `viewerState.ts` is absent and posts still include
synthetic `createdTime`.

- [ ] **Step 3: Memoize Notion reads and add the server route adapter**

Modify `lib/server/notion.ts` to wrap the non-`fetch` Notion client operation in
React `cache()` exactly as documented by Next 16.3:

```ts
import "server-only";
import { cache } from "react";
import { NotionAPI } from "notion-client";

const notion = new NotionAPI({
  apiBaseUrl: "https://app.notion.com/api/v3",
  ofetchOptions: {
    headers: {
      "User-Agent": "notion-client (+https://github.com/NotionX/react-notion-x)",
    },
  },
});

export const getNotionPage = cache((pageId: string) => notion.getPage(pageId));
```

Create `lib/server/contentRoute.ts`:

```ts
import "server-only";
import { notFound, permanentRedirect } from "next/navigation";
import { getNotionPage } from "./notion";
import {
  extractNotionSeoDocument,
  type NotionSeoDocument,
  type SeoFallbacks,
} from "@lib/seo/notion";
import {
  resolveCanonicalPageId,
  type CanonicalContentEntry,
} from "@lib/seo/routes";

type LoadCanonicalNotionPageInput = {
  requestedPageId: string;
  entries: readonly CanonicalContentEntry[];
  basePath: "/article" | "/about";
  fallbacks: SeoFallbacks;
};

export async function loadCanonicalNotionPage(
  input: LoadCanonicalNotionPageInput,
): Promise<{
  pageId: string;
  recordMap: Awaited<ReturnType<typeof getNotionPage>>;
  seo: NotionSeoDocument;
}> {
  const resolution = resolveCanonicalPageId(
    input.requestedPageId,
    input.entries,
  );
  if (resolution.kind === "not-found") notFound();
  if (resolution.kind === "redirect") {
    permanentRedirect(`${input.basePath}/${resolution.pageId}`);
  }

  const recordMap = await getNotionPage(resolution.pageId);
  return {
    pageId: resolution.pageId,
    recordMap,
    seo: extractNotionSeoDocument(recordMap, input.fallbacks),
  };
}
```

- [ ] **Step 4: Remove synthetic post dates and their list markup**

In `features/notion/api.ts`, remove `createdTime` from `ArticlePost` and
`AboutPost` and remove both `createdTime: new Date().getTime()` assignments.
Keep canonical `pageId`, title, slug, and file-node fields unchanged.

In both `app/article/page.tsx` and `app/about/page.tsx`, remove the `<time>`
element rather than substituting another clock value. Keep the crawlable `<Link>`
elements.

- [ ] **Step 5: Replace both detail routes with the shared canonical flow**

For `app/article/[pageId]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { getArticlePosts } from "@features/notion/api";
import { loadCanonicalNotionPage } from "@lib/server/contentRoute";
import {
  createBlogPostingJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from "@lib/seo/metadata";
import ArticleViewerStateInitializer from "./ArticleViewerStateInitializer";

type Props = { params: Promise<{ pageId: string }> };
export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getArticlePosts()).map((post) => ({ pageId: post.pageId }));
}

async function loadArticle(requestedPageId: string) {
  const posts = await getArticlePosts();
  const page = await loadCanonicalNotionPage({
    requestedPageId,
    entries: posts,
    basePath: "/article",
    fallbacks: {
      title: "Article Post",
      description: (title) => `Read more about ${title} on HG Article.`,
    },
  });
  return { posts, ...page };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pageId: requestedPageId } = await params;
  const { pageId, seo } = await loadArticle(requestedPageId);
  return createPageMetadata({
    title: seo.title,
    description: seo.description,
    path: `/article/${pageId}`,
    kind: "article",
    datePublished: seo.datePublished,
    dateModified: seo.dateModified,
  });
}

export default async function ArticlePage({ params }: Props) {
  const { pageId: requestedPageId } = await params;
  const { pageId, recordMap, seo, posts } = await loadArticle(requestedPageId);
  const jsonLd = createBlogPostingJsonLd({
    document: seo,
    path: `/article/${pageId}`,
  });

  return (
    <>
      <div className="sr-only">
        <h1>{seo.title}</h1>
        <article>{seo.description}</article>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <ArticleViewerStateInitializer
        pageId={pageId}
        initialPosts={posts}
        initialRecordMap={recordMap}
      />
    </>
  );
}
```

Replace `app/about/[pageId]/page.tsx` with the same shared flow, using its own
registry, canonical base path, fallback copy, and initializer:

```tsx
import type { Metadata } from "next";
import { getAboutPosts } from "@features/notion/api";
import { loadCanonicalNotionPage } from "@lib/server/contentRoute";
import {
  createBlogPostingJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from "@lib/seo/metadata";
import AboutViewerStateInitializer from "./AboutViewerStateInitializer";

type Props = { params: Promise<{ pageId: string }> };
export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getAboutPosts()).map((post) => ({ pageId: post.pageId }));
}

async function loadAbout(requestedPageId: string) {
  const posts = await getAboutPosts();
  const page = await loadCanonicalNotionPage({
    requestedPageId,
    entries: posts,
    basePath: "/about",
    fallbacks: {
      title: "About Post",
      description: (title) => `Read more about ${title} on HG About.`,
    },
  });
  return { posts, ...page };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pageId: requestedPageId } = await params;
  const { pageId, seo } = await loadAbout(requestedPageId);
  return createPageMetadata({
    title: seo.title,
    description: seo.description,
    path: `/about/${pageId}`,
    kind: "article",
    datePublished: seo.datePublished,
    dateModified: seo.dateModified,
  });
}

export default async function AboutPage({ params }: Props) {
  const { pageId: requestedPageId } = await params;
  const { pageId, recordMap, seo, posts } = await loadAbout(requestedPageId);
  const jsonLd = createBlogPostingJsonLd({
    document: seo,
    path: `/about/${pageId}`,
  });

  return (
    <>
      <div className="sr-only">
        <h1>{seo.title}</h1>
        <article>{seo.description}</article>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <AboutViewerStateInitializer
        pageId={pageId}
        initialPosts={posts}
        initialRecordMap={recordMap}
      />
    </>
  );
}
```

Do not retain either old `unwrapBlock` or manual description extraction
implementation. Both `generateMetadata()` functions use the canonical
`pageId` returned by the loader rather than the requested alias.

- [ ] **Step 6: Hydrate the viewer with the server record map**

Create `features/notion/viewerState.ts`:

```ts
export function shouldFetchNotionPage(
  activePageId: string | null,
  loadedPageId: string | null,
): boolean {
  return Boolean(activePageId && activePageId !== loadedPageId);
}

export type NotionViewerRootUrl = "article" | "about";

export function createNotionViewerParams(
  pageId: string,
  initialRecordMap: unknown,
  rootUrl: NotionViewerRootUrl,
) {
  return { pageId, initialRecordMap, rootUrl };
}
```

Import the fetch decision into `ArticleViewerWindow.tsx`:

```ts
import { shouldFetchNotionPage } from "@features/notion/viewerState";
```

Import `createNotionViewerParams` into both route initializers, and add
`initialRecordMap: unknown` to both initializer props. Article opens:

```ts
open(
  "article-viewer",
  createNotionViewerParams(pageId, initialRecordMap, "article"),
);
```

About opens:

```ts
open(
  "article-viewer",
  createNotionViewerParams(pageId, initialRecordMap, "about"),
);
```

In `ArticleViewerWindow.tsx`, initialize these values from `win.params`:

```ts
const initialRecordMap = win?.params?.initialRecordMap;
const rootUrl = win?.params?.rootUrl === "about" ? "about" : "article";
const [recordMap, setRecordMap] = useState<any>(initialRecordMap ?? null);
const [loadedPageId, setLoadedPageId] = useState<string | null>(
  initialRecordMap ? (initialPageId ?? null) : null,
);
```

Replace the unconditional `if (activePageId)` effect branch with:

```ts
if (!shouldFetchNotionPage(activePageId, loadedPageId)) return;
setLoading(true);
fetchNotionRecordMap(activePageId)
  .then((nextRecordMap) => {
    setRecordMap(nextRecordMap);
    setLoadedPageId(activePageId);
  })
  .catch((error) => console.error(error))
  .finally(() => setLoading(false));
```

Include `loadedPageId` in the effect dependency list and pass `rootUrl` into
`Renderer`. Do not issue a request when the server supplied record map already
matches the active page.

- [ ] **Step 7: Run Task 3 GREEN and existing Notion tests**

```powershell
npx --yes pnpm@10.14.0 test:seo
npx --yes pnpm@10.14.0 test:notion
```

Expected: all SEO behavior tests and both live Notion integration tests PASS.

- [ ] **Step 8: Commit Task 3**

```powershell
git add package.json lib/server/notion.ts lib/server/contentRoute.ts features/notion/api.ts features/notion/viewerState.ts app/article app/about features/article/components/ArticleViewerWindow.tsx tests/seo-content-flow.test.ts
git commit -m "fix: canonicalize Notion detail routes"
```

---

### Task 4: Root metadata, social images, and deterministic sitemap

**Files:**
- Create: `lib/seo/sitemap.ts`
- Create: `lib/seo/socialCard.tsx`
- Create: `app/opengraph-image.tsx`
- Create: `app/twitter-image.tsx`
- Create: `tests/seo-sitemap-social.test.ts`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/article/page.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/sitemap.ts`
- Modify: `app/robots.ts`
- Modify: `.env.example`
- Modify: `package.json`

**Interfaces:**
- Consumes: site URL, Notion SEO timestamps, and metadata builders from Tasks 1-2.
- Produces: deterministic `buildSitemapEntries()` and two 1200x630 PNG metadata routes.
- Root and list pages emit one title, canonical URLs, route-correct OG metadata, and common file-based images.

- [ ] **Step 1: Write sitemap and social-image behavior tests and verify RED**

Create `tests/seo-sitemap-social.test.ts` before application edits:

```ts
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

test("defines generated Open Graph and Twitter image routes", async () => {
  const ogUrl = new URL("../app/opengraph-image.tsx", import.meta.url);
  const twitterUrl = new URL("../app/twitter-image.tsx", import.meta.url);
  assert.ok(existsSync(ogUrl), "app/opengraph-image.tsx should exist");
  assert.ok(existsSync(twitterUrl), "app/twitter-image.tsx should exist");

  const og = await import(ogUrl.href);
  const twitter = await import(twitterUrl.href);
  assert.deepEqual(og.size, { width: 1200, height: 630 });
  assert.equal(og.contentType, "image/png");
  assert.equal(og.default().headers.get("content-type"), "image/png");
  assert.equal(twitter.default().headers.get("content-type"), "image/png");
});

test("builds canonical sitemap entries without invented dates", async () => {
  const sitemapModuleUrl = new URL("../lib/seo/sitemap.ts", import.meta.url);
  assert.ok(existsSync(sitemapModuleUrl), "lib/seo/sitemap.ts should exist");
  const { buildSitemapEntries } = await import(sitemapModuleUrl.href);
  const articleId = "article-id";
  const aboutId = "about-id";
  const modified = "2024-03-09T16:00:00.000Z";
  const entries = buildSitemapEntries({
    baseUrl: "https://example.com",
    articlePosts: [{ pageId: articleId }],
    aboutPosts: [{ pageId: aboutId }],
    lastModifiedByPageId: { [articleId]: modified },
  });

  assert.deepEqual(
    entries.map((entry) => entry.url),
    [
      "https://example.com/",
      "https://example.com/article",
      "https://example.com/about",
      `https://example.com/article/${articleId}`,
      `https://example.com/about/${aboutId}`,
    ],
  );
  for (const entry of entries.slice(0, 3)) {
    assert.equal("lastModified" in entry, false);
  }
  const articleLastModified = entries[3].lastModified;
  assert.ok(articleLastModified instanceof Date);
  assert.equal(articleLastModified.toISOString(), modified);
  assert.equal("lastModified" in entries[4], false);
});
```

Extend `test:seo` in `package.json` with the new behavior test:

```json
"test:seo": "pnpm exec tsx --tsconfig tests/tsconfig.react-server.json --conditions=react-server --test tests/seo-site-route.test.ts tests/seo-notion-metadata.test.ts tests/seo-content-flow.test.ts tests/seo-sitemap-social.test.ts"
```

Run:

```powershell
npx --yes pnpm@10.14.0 test:seo
```

Expected: FAIL because the image and pure sitemap modules do not exist.

- [ ] **Step 2: Implement deterministic sitemap construction**

Create `lib/seo/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import type { CanonicalContentEntry } from "./routes";

type SitemapInput = {
  baseUrl: string;
  articlePosts: readonly CanonicalContentEntry[];
  aboutPosts: readonly CanonicalContentEntry[];
  lastModifiedByPageId: Readonly<Record<string, string | undefined>>;
};

function entry(baseUrl: string, path: string, iso?: string) {
  const date = iso ? new Date(iso) : undefined;
  const validDate = date && !Number.isNaN(date.getTime()) ? date : undefined;
  return {
    url: new URL(path || "/", `${baseUrl}/`).toString(),
    ...(validDate ? { lastModified: validDate } : {}),
  };
}

export function buildSitemapEntries(
  input: SitemapInput,
): MetadataRoute.Sitemap {
  const fixed = ["", "/article", "/about"].map((path) =>
    entry(input.baseUrl, path),
  );
  const articles = input.articlePosts.flatMap((post) =>
    post.pageId
      ? [
          entry(
            input.baseUrl,
            `/article/${post.pageId}`,
            input.lastModifiedByPageId[post.pageId],
          ),
        ]
      : [],
  );
  const about = input.aboutPosts.flatMap((post) =>
    post.pageId
      ? [
          entry(
            input.baseUrl,
            `/about/${post.pageId}`,
            input.lastModifiedByPageId[post.pageId],
          ),
        ]
      : [],
  );
  return [...fixed, ...articles, ...about];
}
```

Replace `app/sitemap.ts` with a one-hour cached Node route that loads timestamps
per canonical entry with `Promise.all`, catches each lookup separately, and
passes a `Record<string, string | undefined>` to `buildSitemapEntries()`:

```ts
import type { MetadataRoute } from "next";
import { getAboutPosts, getArticlePosts } from "@features/notion/api";
import { extractNotionSeoDocument } from "@lib/seo/notion";
import { getSiteBaseUrl } from "@lib/seo/site";
import { buildSitemapEntries } from "@lib/seo/sitemap";
import { getNotionPage } from "@lib/server/notion";

export const runtime = "nodejs";
export const revalidate = 3600;

async function loadLastModified(
  pageId: string,
): Promise<readonly [string, string | undefined]> {
  try {
    const recordMap = await getNotionPage(pageId);
    const seo = extractNotionSeoDocument(recordMap, {
      title: "HG Blog",
      description: "HG Blog content",
    });
    return [pageId, seo.dateModified ?? seo.datePublished] as const;
  } catch (error) {
    console.error("Failed to load a sitemap timestamp", { pageId, error });
    return [pageId, undefined] as const;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articlePosts, aboutPosts] = await Promise.all([
    getArticlePosts(),
    getAboutPosts(),
  ]);
  const pageIds = [...articlePosts, ...aboutPosts].flatMap((post) =>
    post.pageId ? [post.pageId] : [],
  );
  const lastModifiedByPageId: Record<string, string | undefined> =
    Object.fromEntries(await Promise.all(pageIds.map(loadLastModified)));

  return buildSitemapEntries({
    baseUrl: getSiteBaseUrl(),
    articlePosts,
    aboutPosts,
    lastModifiedByPageId,
  });
}
```

- [ ] **Step 3: Move root and list pages entirely onto the Metadata API**

In `app/layout.tsx`:

```ts
import { createRootMetadata } from "@lib/seo/metadata";
export const metadata = createRootMetadata();
```

Remove the manual `<head>` element in full. Next supplies charset and viewport,
while `createRootMetadata()` supplies title, icon, and verification.

Remove the child metadata export from `app/page.tsx` so the home page inherits
the root default title exactly once.

In `app/article/page.tsx`, replace the `Metadata` import and object with:

```ts
import { createPageMetadata } from "@lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "HG Articles",
  description: "HG's Tech Articles",
  path: "/article",
});
```

In `app/about/page.tsx`, replace its `Metadata` import and object with:

```ts
import { createPageMetadata } from "@lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "HG About",
  description: "HG's About",
  path: "/about",
});
```

These complete nested Open Graph objects intentionally, because Next 16.3
shallowly replaces nested metadata fields.

Keep `app/robots.ts` behavior but import the normalized Task 1 site helper
directly from `@lib/seo/site`.

- [ ] **Step 4: Implement the common Windows 98 social card**

Create `lib/seo/socialCard.tsx` using only supported `ImageResponse` flexbox
styles:

```tsx
import { ImageResponse } from "next/og";

export const socialImageAlt = "HG Blog - Windows 98-style developer blog";
export const socialImageSize = { width: 1200, height: 630 };
export const socialImageContentType = "image/png";

export function createSocialCard(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#008080",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: 960,
          display: "flex",
          flexDirection: "column",
          background: "#c0c0c0",
          borderTop: "8px solid #ffffff",
          borderLeft: "8px solid #ffffff",
          borderRight: "8px solid #404040",
          borderBottom: "8px solid #404040",
          padding: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#000080",
            color: "white",
            fontSize: 34,
            fontWeight: 700,
            padding: "12px 18px",
          }}
        >
          <span>HG Blog</span><span>×</span>
        </div>
        <div
          style={{
            minHeight: 360,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "50px 58px",
            color: "#111111",
          }}
        >
          <div style={{ display: "flex", fontSize: 78, fontWeight: 700 }}>
            HG BLOG
          </div>
          <div style={{ display: "flex", fontSize: 34, marginTop: 28 }}>
            Development journeys, notes, and experiments.
          </div>
        </div>
      </div>
    </div>,
    socialImageSize,
  );
}
```

Create both route files as thin adapters. `app/opengraph-image.tsx`:

```tsx
import {
  createSocialCard,
  socialImageAlt,
  socialImageContentType,
  socialImageSize,
} from "@lib/seo/socialCard";

export const alt = socialImageAlt;
export const size = socialImageSize;
export const contentType = socialImageContentType;
export default function Image() {
  return createSocialCard();
}
```

Create `app/twitter-image.tsx` as the Twitter adapter:

```tsx
import {
  createSocialCard,
  socialImageAlt,
  socialImageContentType,
  socialImageSize,
} from "@lib/seo/socialCard";

export const alt = socialImageAlt;
export const size = socialImageSize;
export const contentType = socialImageContentType;
export default function Image() {
  return createSocialCard();
}
```

The two file-based routes make Next emit both `og:image` and `twitter:image`
tags.

- [ ] **Step 5: Document the production origin and run Task 4 GREEN**

Add this non-secret entry near the top of `.env.example`:

```dotenv
# Canonical public origin used by metadata, robots, and sitemap.
NEXT_PUBLIC_SITE_URL=https://hg-blog.vercel.app
```

Run:

```powershell
npx --yes pnpm@10.14.0 test:seo
```

Expected: every SEO behavior test PASS, including construction
of both PNG responses.

- [ ] **Step 6: Commit Task 4**

```powershell
git add package.json .env.example app/layout.tsx app/page.tsx app/article/page.tsx app/about/page.tsx app/sitemap.ts app/robots.ts app/opengraph-image.tsx app/twitter-image.tsx lib/seo/sitemap.ts lib/seo/socialCard.tsx tests/seo-sitemap-social.test.ts
git commit -m "feat: complete SEO metadata and sitemap"
```

---

## Final verification

- [ ] **Step 1: Run repository verification from a pnpm 10.14 frozen install**

```powershell
$env:CI='true'
$env:NEXT_PUBLIC_SITE_URL='https://hg-blog.vercel.app'
npx --yes pnpm@10.14.0 install --frozen-lockfile
npx --yes pnpm@10.14.0 test
npx --yes pnpm@10.14.0 exec tsc --noEmit --incremental false
npx --yes pnpm@10.14.0 lint
npx --yes pnpm@10.14.0 build
```

Expected: frozen install, security tests, SEO tests, both Notion integration
tests, typecheck, lint, and Next 16.3 production build all exit 0. Record any
external Notion failure separately; do not describe a network-blocked test as
passing.

- [ ] **Step 2: Start the production server and inspect HTTP behavior**

Start `next start` on an unused local port with `NEXT_PUBLIC_SITE_URL` set to
`https://hg-blog.vercel.app`:

```powershell
$env:NEXT_PUBLIC_SITE_URL='https://hg-blog.vercel.app'
npx --yes pnpm@10.14.0 exec next start -p 5180
```

From a second shell, verify:

```text
GET /                                                     -> 200, one title, canonical /
GET /article                                              -> 200, canonical /article, OG image
GET /article/2f5145eb576b806db310ffae54659a96             -> 200, BlogPosting JSON-LD
GET /article/279145eb576b8035b39bd83c7dac0830             -> 308 to the prefixed canonical ID
GET /article/279145eb-576b-8035-b39b-d83c7dac0830         -> 308 to the same canonical ID
GET /article/not-a-real-page                              -> 404 with noindex
GET /about/not-a-real-page                                -> 404 with noindex
GET /robots.txt                                           -> 200 with production sitemap URL
GET /sitemap.xml                                          -> 200 with nine canonical URLs
GET /opengraph-image                                      -> 200 image/png, 1200x630
GET /twitter-image                                        -> 200 image/png, 1200x630
```

Fetch `sitemap.xml` twice and compare the content. Expected: identical
`lastmod` values across requests; no request-time timestamps.

- [ ] **Step 3: Inspect the final diff and generated Next files**

```powershell
git diff --check
git status --short
git log --oneline -6
```

If Next 16.3 legitimately regenerates `AGENTS.md` or `next-env.d.ts`, inspect
the exact diff and include only the documented generated change. Do not leave
`.next` output or temporary server files tracked.

- [ ] **Step 4: Request code review before integration**

Invoke `superpowers:requesting-code-review` against the complete implementation
diff, address verified findings, and rerun the affected focused plus full
verification commands before declaring completion.
