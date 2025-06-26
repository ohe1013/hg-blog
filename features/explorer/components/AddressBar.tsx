import React from "react";
import { useFileExplorerStore } from "../../../zustand/file/fileExplore";

export const AddressBar: React.FC = () => {
  const { currentPath, enterFolder, resetToRoot, goBack } =
    useFileExplorerStore();
  return (
    <div className="address-bar">
      <button onClick={goBack} disabled={currentPath.length === 0}>
        ◀
      </button>
      <button onClick={resetToRoot}>C:</button>
      {currentPath.map((seg, i) => (
        <React.Fragment key={i}>
          <span> &gt; </span>
          <button onClick={() => enterFolder(seg)}>{seg}</button>
        </React.Fragment>
      ))}
    </div>
  );
};
