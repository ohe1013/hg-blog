import { useExplorerContext } from "../stores/ExplorerContext";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import { launchFileNode } from "@lib/utils/launcher";

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

    const result = launchFileNode(node, id, { open: openApp });
    if (!result.ok) {
      console.warn(result.message);
    }
  };

  return { handleOpen };
};
