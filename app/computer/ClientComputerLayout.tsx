"use client";
import { useApplicationStore } from "../../zustand/application/applicationProvider";
import SharedExplorerLayout from "@features/explorer/components/SharedExplorerLayout";

export default function ComputerWindow({ winId }: { winId: string }) {
  const { getById } = useApplicationStore((s) => s);
  const win = getById(winId);
  if (!win) return null;

  return (
    <SharedExplorerLayout
      winId={winId}
      explorerId="computer"
      sidebarConfig={{
        iconUrl: "https://98.js.org/images/icons/hard-disk-drive-32x32.png",
        title: "(C:)",
        defaultInfo: "Select an item to view its description.",
      }}
    />
  );
}
