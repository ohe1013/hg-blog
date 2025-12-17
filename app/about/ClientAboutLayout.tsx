"use client";

import { BlogPost } from "@features/notion/api";
import { useApplicationStore } from "../../zustand/application/applicationProvider";
import SharedExplorerLayout from "@features/explorer/components/SharedExplorerLayout";

export default function AboutWindow({ winId }: { winId: string }) {
  const { getById, updateParams } = useApplicationStore((s) => s);
  const win = getById(winId);
  if (!win) return null;

  const initialPosts = win.params?.initialPosts as BlogPost[] | undefined;

  return (
    <SharedExplorerLayout
      winId={winId}
      explorerId="about"
      sidebarConfig={{
        iconUrl: "/assets/img/notion-logo-no-background.png",
        title: "About",
        defaultInfo: "Information about me.",
        iconStyle: { width: 32, height: 32 },
      }}
      initialPosts={initialPosts}
    />
  );
}
