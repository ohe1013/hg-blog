"use client";

import { useEffect, useRef } from "react";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import { BlogPost } from "@features/notion/api";

interface BlogViewerStateInitializerProps {
  pageId: string;
  initialPosts: BlogPost[];
}

export default function BlogViewerStateInitializer({
  pageId,
  initialPosts,
}: BlogViewerStateInitializerProps) {
  const { open } = useApplicationStore((s) => s);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 1. Open the blog explorer window
    open("blog", { initialPosts });

    // 2. Open the specific blog viewer window
    open("blog-viewer", { pageId });
  }, [pageId, initialPosts, open]);

  return null;
}
