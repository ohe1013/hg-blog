import { useExplorerContext } from "@features/explorer/stores/ExplorerContext";
import { Fragment } from "react";

interface SharedExplorerSidebarProps {
  iconUrl: string;
  title: string;
  defaultInfo: string;
  selectedIds: Set<string>;
  iconStyle?: React.CSSProperties;
}

export default function SharedExplorerSidebar({
  iconUrl,
  title,
  defaultInfo,
  selectedIds,
  iconStyle,
}: SharedExplorerSidebarProps) {
  const { fs } = useExplorerContext((s) => s);
  const selectedNodes = Array.from(selectedIds || [])
    .map((id) => fs.byId[id])
    .filter((node) => !!node);

  return (
    <Fragment>
      {/* <p>
        <img draggable="false" src={iconUrl} style={iconStyle} />
      </p>
      <p className="Title">{title}</p>
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
          <span id="Info">{defaultInfo}</span>
        )}
      </p> */}
    </Fragment>
  );
}
