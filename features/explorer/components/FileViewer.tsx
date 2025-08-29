import { Suspense } from "react";
import { useExplorer } from "../stores/fileExplorer";
import { viewerRegistry } from "../viewers/registry";

export const FileViewer = () => {
  const { fs, currentId } = useExplorer();
  const node = fs.byId[currentId];
  if (!node || node.kind !== "file") return null;

  const Comp = viewerRegistry[node.app] ?? viewerRegistry["text-viewer"];
  return (
    <Suspense fallback={<div style={{ padding: 8 }}>Loading viewer…</div>}>
      <Comp file={node} />
    </Suspense>
  );
};
