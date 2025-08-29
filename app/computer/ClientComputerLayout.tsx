"use client";
import {
  Window,
  WindowAddressBar,
  WindowBody,
  WindowMainBody,
  WindowMenuBar,
  WindowResizeHeader,
  WindowSideBar,
  WindowStatus,
} from "../../features/window/components";
import { Fragment, ReactNode } from "react";
import { useDragSelect } from "@lib/hooks/useDrag";
import { useApplicationStore } from "../../zustand/application/applicationProvider";
import { useExplorer } from "@features/explorer/stores/fileExplorer";
import { FolderGrid } from "@features/explorer/components/FolderGrid";
import { FileViewer } from "@features/explorer/components/FileViewer";
export default function ComputerClientLayout() {
  const { computer } = useApplicationStore((state) => state.application);
  const { containerRef, selection, bindMouseDown, SelectionRect } =
    useDragSelect<"blog" | "about" | "computer" | "document">();
  const { fs, currentId } = useExplorer();
  const current = fs.byId[currentId];
  return (
    <Fragment>
      {computer.useApplication === true ? (
        <Window title="computer">
          <WindowResizeHeader />
          <WindowMenuBar />
          <WindowAddressBar />
          <WindowBody>
            <WindowSideBar />
            <WindowMainBody
              containerRef={containerRef}
              onMouseDown={bindMouseDown}
            >
              {current?.kind === "folder" ? <FolderGrid /> : <FileViewer />}
            </WindowMainBody>
          </WindowBody>
          <WindowStatus />
        </Window>
      ) : null}
      {selection.visible && (
        <SelectionRect
          x={selection.x}
          y={selection.y}
          w={selection.w}
          h={selection.h}
        />
      )}
    </Fragment>
  );
}
