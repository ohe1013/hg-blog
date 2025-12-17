"use client";
import { useApplicationStore } from "../../zustand/application/applicationProvider";
import SharedExplorerLayout from "@features/explorer/components/SharedExplorerLayout";
import { BlogPost } from "@features/notion/api";

export default function BlogWindow({ winId }: { winId: string }) {
  const { getById } = useApplicationStore((s) => s);
  const win = getById(winId);
  if (!win) return null;

  const initialPosts = win.params?.initialPosts as BlogPost[] | undefined;

  return (
    <SharedExplorerLayout
      winId={winId}
      explorerId="blog"
      sidebarConfig={{
        iconUrl: "/assets/img/notion-logo-no-background.png",
        title: "Blog",
        defaultInfo:
          "Welcome to my tech blog. Here you can find my latest posts and thoughts.",
        iconStyle: { width: 32, height: 32 },
      }}
      initialPosts={initialPosts}
    />
  );
}
