import { useExplorerContext } from "../stores/ExplorerContext";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";

export const useItemInteraction = () => {
  const { fs, open } = useExplorerContext((s) => s);
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
          : node.app === "article-viewer"
          ? "article-viewer"
          : (node.app as any);

      if (appKey === "notepad") {
        openApp("notepad", { fileId: id });
      } else if (appKey === "article-viewer") {
        // Open blog viewer window
        openApp("article-viewer", {
          fileId: id,
        });
      } else {
        console.warn("No app for", node.app);
      }
    }
  };

  return { handleOpen };
};
