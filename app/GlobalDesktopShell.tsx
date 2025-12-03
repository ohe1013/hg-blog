"use client";

import React from "react";
import { useDragSelect } from "@lib/hooks/useDrag";
import { DesktopIconGrid } from "@features/desktop/components";
import { StartBar } from "@features/startBar/components";
import { AppsType } from "../zustand/application/applicationStore";

// 전역 데스크톱 Background & 아이콘 & 시작바만 담당
export default function GlobalDesktopShell() {
  const {
    containerRef,
    itemRefs,
    selection,
    selectedIds,
    bindMouseDown,
    SelectionRect,
    setSelectedIds,
  } = useDragSelect<AppsType>();

  return (
    <div
      id="global-desktop"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0, // ✅ 뒤쪽 레이어
        pointerEvents: "auto", // 아이콘 상호작용 가능
      }}
    >
      <DesktopIconGrid
        containerRef={containerRef}
        onMouseDown={bindMouseDown}
        itemRefs={itemRefs}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />
      <StartBar />
      {selection.visible && (
        <SelectionRect
          x={selection.x}
          y={selection.y}
          w={selection.w}
          h={selection.h}
        />
      )}
    </div>
  );
}
