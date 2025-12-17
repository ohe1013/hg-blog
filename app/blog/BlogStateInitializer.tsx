"use client";

import { useEffect, useRef } from "react";
import { useApplicationStore } from "../../zustand/application/applicationProvider";
import { BlogPost } from "@features/notion/api";

interface BlogStateInitializerProps {
  initialPosts: BlogPost[];
}

export default function BlogStateInitializer({
  initialPosts,
}: BlogStateInitializerProps) {
  const { open } = useApplicationStore((s) => s);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Open the blog window with the fetched posts
    open("blog", { initialPosts });
  }, [initialPosts, open]);

  return null;
}
