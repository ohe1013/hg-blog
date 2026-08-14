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
