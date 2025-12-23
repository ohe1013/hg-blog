"use client";

import { useEffect, useRef } from "react";
import { useApplicationStore } from "../../zustand/application/applicationProvider";
import { ArticlePost } from "@features/notion/api";

interface ArticleStateInitializerProps {
  initialPosts: ArticlePost[];
}

export default function ArticleStateInitializer({
  initialPosts,
}: ArticleStateInitializerProps) {
  const { open } = useApplicationStore((s) => s);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    open("articles", { initialPosts });
  }, [initialPosts, open]);

  return null;
}
