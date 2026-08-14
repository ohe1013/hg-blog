"use client";

import { useEffect, useRef } from "react";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import { AboutPost } from "@features/notion/api";
import { createNotionViewerParams } from "@features/notion/viewerState";

interface AboutViewerStateInitializerProps {
  pageId: string;
  initialPosts: AboutPost[];
  initialRecordMap: unknown;
}

export default function AboutViewerStateInitializer({
  pageId,
  initialPosts,
  initialRecordMap,
}: AboutViewerStateInitializerProps) {
  const { open } = useApplicationStore((s) => s);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 1. Open the about explorer window
    open("about", { initialPosts });

    // 2. Open the specific about viewer window
    open(
      "article-viewer",
      createNotionViewerParams(pageId, initialRecordMap, "about"),
    );
  }, [pageId, initialPosts, initialRecordMap, open]);

  return null;
}
