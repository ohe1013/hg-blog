"use client";

import { useEffect, useRef } from "react";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import { AboutPost } from "@features/notion/api";

interface AboutViewerStateInitializerProps {
  pageId: string;
  initialPosts: AboutPost[];
}

export default function AboutViewerStateInitializer({
  pageId,
  initialPosts,
}: AboutViewerStateInitializerProps) {
  const { open } = useApplicationStore((s) => s);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 1. Open the about explorer window
    open("about", { initialPosts });

    // 2. Open the specific about viewer window
    open("article-viewer", { pageId });
  }, [pageId, initialPosts, open]);

  return null;
}
