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
      return;
    }

    const appKey = node.app;
    if (appKey === "notepad") {
      openApp("notepad", { fileId: id });
    } else if (appKey === "article-viewer") {
      openApp("article-viewer", { fileId: id });
    } else if (appKey === "external-link-confirm") {
      const payload = node.payload as { url: string };
      if (payload.url) {
        openApp("external-link-confirm", { url: payload.url });
      }
    } else if (appKey === "guestbook") {
      openApp("guestbook");
    } else if (appKey === "contact") {
      openApp("contact");
    } else {
      console.warn("No app for", node.app);
    }
  };

  return { handleOpen };
};
