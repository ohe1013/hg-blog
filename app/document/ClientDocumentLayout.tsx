"use client";
import { useApplicationStore } from "../../zustand/application/applicationProvider";
import SharedExplorerLayout from "@features/explorer/components/SharedExplorerLayout";

export default function DocumentWindow({ winId }: { winId: string }) {
  const { getById } = useApplicationStore((s) => s);
  const win = getById(winId);
  if (!win) return null;

  return (
    <SharedExplorerLayout
      winId={winId}
      explorerId="document"
      sidebarConfig={{
        iconUrl:
          "https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-1.png",
        title: "My Documents",
        defaultInfo: "Select an item to view its description.",
      }}
    />
  );
}
