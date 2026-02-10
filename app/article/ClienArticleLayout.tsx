"use client";
import { useApplicationStore } from "../../zustand/application/applicationProvider";
import SharedExplorerLayout from "@features/explorer/components/SharedExplorerLayout";
import { ArticlePost } from "@features/notion/api";

export default function ArticleWindow({ winId }: { winId: string }) {
  const { getById } = useApplicationStore((s) => s);
  const win = getById(winId);
  if (!win) return null;

  const initialPosts = win.params?.initialPosts as ArticlePost[] | undefined;

  return (
    <SharedExplorerLayout
      winId={winId}
      explorerId="articles"
      sidebarConfig={{
        iconUrl: "/assets/img/notion-logo-no-background.png",
        title: "Articles",
        defaultInfo:
          "Welcome to my tech articles. Here you can find my latest posts and thoughts.",
        iconStyle: { width: 32, height: 32 },
      }}
      // initialPosts={initialPosts}
    />
  );
}
