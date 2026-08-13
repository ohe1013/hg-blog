import "server-only";

import { NotionAPI } from "notion-client";

const notion = new NotionAPI({
  apiBaseUrl: "https://app.notion.com/api/v3",
  ofetchOptions: {
    headers: {
      "User-Agent": "notion-client (+https://github.com/NotionX/react-notion-x)",
    },
  },
});

export function getNotionPage(pageId: string) {
  return notion.getPage(pageId);
}
