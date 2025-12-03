import { DesktopGrid, DesktopGridItem } from "@features/desktop/components";
import { useExplorer } from "../stores/fileExplorer";
import { handleGridNavigation } from "@lib/utils/keyboard";
import { useState } from "react";

interface FolderGridProps {
  containerRef: React.Ref<HTMLDivElement>;
  onMouseDown: (e: React.MouseEvent) => void;
  itemRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  selectedIds: Set<string>;
  setSelectedIds: (ids: Set<string>) => void;
}

export const FolderGrid = ({
  containerRef,
  onMouseDown,
  itemRefs,
  selectedIds,
  setSelectedIds,
}: FolderGridProps) => {
  const { fs, currentId, open } = useExplorer();
  const [rows, setRows] = useState(1);
  const cur = fs.byId[currentId];

  if (!cur || cur.kind !== "folder") return null;

  const children = cur.children.map((id) => fs.byId[id]).filter(Boolean);
  const keys = children.map((c) => c.id);

  return (
    <DesktopGrid
      containerRef={containerRef}
      onMouseDown={onMouseDown}
      flow="row"
      className="relative w-full h-full"
      onRowsChange={setRows}
    >
      {children.map((node, index) => (
        <div
          key={node.id}
          data-key={node.id}
          ref={(el) => {
            itemRefs.current[node.id] = el;
          }}
          onKeyDown={(e) =>
            handleGridNavigation(
              e,
              index,
              rows,
              keys,
              itemRefs,
              "row",
              setSelectedIds
            )
          }
        >
          <DesktopGridItem
            label={node.name}
            iconUrl={
              "https://win98icons.alexmeub.com/images/directory_closed-3.png"
            }
            selected={selectedIds.has(node.id)}
            onOpen={() => open(node.id)}
          />
        </div>
      ))}
    </DesktopGrid>
  );
};
