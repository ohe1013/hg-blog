"use client";

import { ArticlePost } from "@features/notion/api";
import { useApplicationStore } from "../../zustand/application/applicationProvider";
import SharedExplorerLayout from "@features/explorer/components/SharedExplorerLayout";
import { EXPLORER_ROOT } from "@features/explorer/data";
import { iconDict } from "@features/fs/data/icon";

export default function AboutWindow({ winId }: { winId: string }) {
  const { getById } = useApplicationStore((s) => s);
  const win = getById(winId);
  if (!win) return null;

  const initialPosts = win.params?.initialPosts as ArticlePost[] | undefined;

  return (
    <SharedExplorerLayout
      winId={winId}
      explorerId={EXPLORER_ROOT.about}
      sidebarConfig={{
        iconUrl: iconDict.notion,
        title: "About",
        defaultInfo: "Information about me.",
        iconStyle: { width: 32, height: 32 },
      }}
      // initialPosts={initialPosts}
    />
  );
}
