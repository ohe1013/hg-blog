"use client";

import { useEffect, useRef } from "react";
import { useApplicationStore } from "../../zustand/application/applicationProvider";
import Renderer from "@features/notion/Renderer";
import { rootDir } from "@features/notion/data";

interface BlogSSRWrapperProps {
  recordMap: any;
  pageId: string;
}

export default function BlogSSRWrapper({
  recordMap,
  pageId,
}: BlogSSRWrapperProps) {
  const { open, getById, updateParams } = useApplicationStore((s) => s);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Check if blog window already exists
    // We need a way to find a window by app type or ID if it's a singleton-like behavior
    // For now, we'll just try to open it with the specific pageId and initialData.
    // The `openWindow` logic in store might need adjustment if we want to update an existing one
    // or we can just rely on `openWindow` handling duplicates or focusing.

    // However, since this is the "entry point" from SSR, we want to ensure the user sees this content.
    // We'll use a specific ID or just let the store handle it.
    // Let's assume we want to open/update the blog window showing this page.

    open("blog", { pageId }, recordMap);
  }, [pageId, recordMap, open]);

  return (
    <Renderer
      recordMap={recordMap}
      rootPageId={pageId}
      rootUrl="blog"
      // We don't pass onNavigate here because this Renderer is just for SEO/SSR.
      // The interactive one is inside the Window.
    />
  );
}
