import { useExplorer } from "../stores/fileExplorer";

export const FolderGrid = () => {
  const { fs, currentId, open } = useExplorer();
  const cur = fs.byId[currentId];
  if (!cur || cur.kind !== "folder") return null;

  const children = cur.children.map((id) => fs.byId[id]).filter(Boolean);

  return (
    <div className="grid">
      {children.map((node) => (
        <div
          key={node.id}
          className="grid-item"
          onDoubleClick={() => open(node.id)}
        >
          <div className={`icon ${node.kind}`} />
          <div className="label">{node.name}</div>
        </div>
      ))}
    </div>
  );
};
