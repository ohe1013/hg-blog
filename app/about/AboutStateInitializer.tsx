"use client";

import { useEffect, useRef } from "react";
import { useApplicationStore } from "../../zustand/application/applicationProvider";
import { ArticlePost } from "@features/notion/api";

interface AboutStateInitializerProps {
  initialPosts: ArticlePost[];
}

export default function AboutStateInitializer({
  initialPosts,
}: AboutStateInitializerProps) {
  const { open } = useApplicationStore((s) => s);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    open("about", { initialPosts });
  }, [initialPosts, open]);

  return null;
}
