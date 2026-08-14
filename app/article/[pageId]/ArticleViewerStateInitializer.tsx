"use client";

import { useEffect, useRef } from "react";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import { ArticlePost } from "@features/notion/api";
import { createNotionViewerParams } from "@features/notion/viewerState";

interface ArticleViewerStateInitializerProps {
  pageId: string;
  initialPosts: ArticlePost[];
  initialRecordMap: unknown;
}

export default function ArticleViewerStateInitializer({
  pageId,
  initialPosts,
  initialRecordMap,
}: ArticleViewerStateInitializerProps) {
  const { open } = useApplicationStore((s) => s);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 1. Open the blog explorer window
    open("articles", { initialPosts });

    // 2. Open the specific blog viewer window
    open(
      "article-viewer",
      createNotionViewerParams(pageId, initialRecordMap, "article"),
    );
  }, [pageId, initialPosts, initialRecordMap, open]);

  return null;
}
