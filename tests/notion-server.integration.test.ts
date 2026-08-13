import assert from "node:assert/strict";
import test from "node:test";

import { getNotionPage } from "../lib/server/notion";

const PUBLISHED_PAGE_ID = "2f5145eb576b806db310ffae54659a96";

test(
  "shared server Notion reader returns blocks for the published page",
  { timeout: 30_000 },
  async () => {
    const recordMap = await getNotionPage(PUBLISHED_PAGE_ID);

    assert.ok(Object.keys(recordMap.block ?? {}).length > 0);
  },
);
