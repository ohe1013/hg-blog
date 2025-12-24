"use client";

import { useEffect, useRef } from "react";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import { ArticlePost } from "@features/notion/api";

interface ArticleViewerStateInitializerProps {
  pageId: string;
  initialPosts: ArticlePost[];
}

export default function ArticleViewerStateInitializer({
  pageId,
  initialPosts,
}: ArticleViewerStateInitializerProps) {
  const { open } = useApplicationStore((s) => s);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 1. Open the blog explorer window
    open("articles", { initialPosts });

    // 2. Open the specific blog viewer window
    open("article-viewer", { pageId });
  }, [pageId, initialPosts, open]);

  return null;
}
