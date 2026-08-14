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
