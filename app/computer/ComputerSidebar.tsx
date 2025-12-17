import { useExplorerContext } from "@features/explorer/stores/ExplorerContext";
import { Fragment } from "react";

interface ComputerSidebarProps {
  selectedIds: Set<string>;
}
export default function ComputerSidebar({ selectedIds }: ComputerSidebarProps) {
  const { fs } = useExplorerContext((s) => s);
  const selectedNodes = Array.from(selectedIds || [])
    .map((id) => fs.byId[id])
    .filter((node) => !!node);

  return (
    <Fragment>
      <p>
        <img
          draggable="false"
          src="https://98.js.org/images/icons/hard-disk-drive-32x32.png"
        />
      </p>
      <p className="Title">(C:)</p>
      <p className="LogoLine">
        <img
          src="https://98.js.org/src/WEB//wvline.gif"
          width="100%"
          height="1px"
        />
      </p>
      <p>
        {selectedNodes.length === 1 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <span style={{ fontWeight: "bold" }}>{selectedNodes[0].name}</span>
            <span>
              {selectedNodes[0].kind === "folder"
                ? "folder"
                : selectedNodes[0].type || "File"}
            </span>
          </div>
        ) : selectedNodes.length > 1 ? (
          <div style={{ whiteSpace: "pre-wrap" }}>
            {selectedNodes.map((n) => n.name).join("\n")}
          </div>
        ) : (
          <span id="Info">Select an item to view its description.</span>
        )}
      </p>

      <div id="Media"></div>
    </Fragment>
  );
}
