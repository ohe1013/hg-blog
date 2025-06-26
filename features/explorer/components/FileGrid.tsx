import React from "react";
import {
  FileNode,
  useFileExplorerStore,
} from "../../../zustand/file/fileExplore";

export const FileGrid: React.FC = () => {
  const { root, currentPath, enterFolder } = useFileExplorerStore();

  // traverse tree to current folder
  const nodes: FileNode[] = currentPath.reduce((nodes, seg) => {
    const folder = nodes.find((n) => n.name === seg && n.type === "folder");
    return folder && folder.children ? folder.children : [];
  }, root as FileNode[]);

  const handleDoubleClick = (node: FileNode) => {
    if (node.type === "folder") {
      enterFolder(node.name);
    } else {
      // TODO: open file via desktop store
    }
  };

  return (
    <div className="file-grid">
      {nodes.map((node) => (
        <div
          key={node.id}
          className="file-icon"
          onDoubleClick={() => handleDoubleClick(node)}
        >
          <img src={node.iconUrl} alt={node.name} />
          <div className="file-label">{node.name}</div>
        </div>
      ))}
    </div>
  );
};
