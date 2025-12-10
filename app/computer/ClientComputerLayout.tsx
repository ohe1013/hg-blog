"use client";
import { Fragment } from "react";
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
import { useApplicationStore } from "../../zustand/application/applicationProvider";
import { useDragSelect } from "@lib/hooks/useDrag";
import { useExplorer } from "@features/explorer/stores/fileExplorer";
import { ExplorerGridContainer } from "@features/explorer/components/ExplorerGrid";
import ComputerSidebar from "@app/computer/ComputerSidebar";

// 블로그 창 1개 인스턴스를 렌더하는 컴포넌트
export default function WindowWindow({ winId }: { winId: string }) {
  const { getById } = useApplicationStore((s) => s);
  const win = getById(winId);
  const {
    containerRef,
    selection,
    bindMouseDown,
    SelectionRect,
    itemRefs,
    selectedIds,
    setSelectedIds,
  } = useDragSelect<string>();
  const { fs, currentId } = useExplorer();
  if (!win) return null; // 이미 닫혔을 수 있음
  const current = fs.byId[currentId];
  return (
    <Fragment>
      <Window winId={winId}>
        <WindowResizeHeader />
        <WindowMenuBar />
        <WindowAddressBar />
        <WindowBody style={{ display: "flex" }}>
          <WindowSideBar>
            <ComputerSidebar />
          </WindowSideBar>
          <WindowMainBody>
            <ExplorerGridContainer
              containerRef={containerRef}
              onMouseDown={bindMouseDown}
              itemRefs={itemRefs}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
            />
          </WindowMainBody>
        </WindowBody>
        <WindowStatus />
      </Window>
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
