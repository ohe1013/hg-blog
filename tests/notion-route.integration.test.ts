import assert from "node:assert/strict";
import test from "node:test";

import { NextRequest } from "next/server";

import { GET } from "../app/api/notion/page/[pageId]/route";

const PUBLISHED_PAGE_ID = "2f5145eb576b806db310ffae54659a96";

test(
  "GET /api/notion/page returns a record map for the published Notion page",
  { timeout: 30_000 },
  async () => {
    const response = await GET(
      new NextRequest(`http://localhost/api/notion/page/${PUBLISHED_PAGE_ID}`),
      { params: Promise.resolve({ pageId: PUBLISHED_PAGE_ID }) },
    );

    assert.equal(response.status, 200);

    const body = (await response.json()) as {
      recordMap?: { block?: Record<string, unknown> };
    };
    assert.ok(Object.keys(body.recordMap?.block ?? {}).length > 0);
  },
);
