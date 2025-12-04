import { useExplorer } from "../stores/fileExplorer";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";

export const useItemInteraction = () => {
  const { fs, open } = useExplorer();
  const { open: openApp } = useApplicationStore((s) => s);

  const handleOpen = (id: string) => {
    const node = fs.byId[id];
    if (!node) return;

    if (node.kind === "folder") {
      open(id);
    } else {
      // 파일이면 앱 실행
      const appKey =
        node.app === "markdown-viewer" || node.app === "text-viewer"
          ? "notepad"
          : (node.app as any);

      if (appKey === "notepad") {
        openApp("notepad", { fileId: id });
      } else {
        console.warn("No app for", node.app);
      }
    }
  };

  return { handleOpen };
};
