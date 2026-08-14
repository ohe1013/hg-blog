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
