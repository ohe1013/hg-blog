"use client";
import { Fragment, ReactNode } from "react";
import { useApplicationStore } from "../../zustand/application/applicationProvider";
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
import { useDragSelect } from "@lib/hooks/useDrag";
export default function ComputerWrapper({ children }: { children: ReactNode }) {
  const { computer } = useApplicationStore((state) => state.application);
  const {
    containerRef,
    itemRefs,
    selection,
    selectedIds,
    bindMouseDown,
    SelectionRect,
  } = useDragSelect<"blog" | "about" | "computer" | "document">();
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
              {children}
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
