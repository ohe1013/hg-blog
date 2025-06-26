"use client";
import React from "react";

import { useDragSelect } from "@lib/hooks/useDrag";
import { Desktop, DesktopIconGrid } from ".";
import { StartBar } from "@features/startBar/components";

type Props = {
  children: React.ReactNode;
  blog: React.ReactNode;
  about: React.ReactNode;
  computer: React.ReactNode;
  document: React.ReactNode;
};

export default function ClientDesktopWrapper({
  children,
  blog,
  about,
  computer,
  document,
}: Props) {
  const {
    containerRef,
    itemRefs,
    selection,
    selectedIds,
    bindMouseDown,
    SelectionRect,
  } = useDragSelect<"blog" | "about" | "computer" | "document">();
  return (
    <>
      <Desktop containerRef={containerRef} onMouseDown={bindMouseDown}>
        <DesktopIconGrid itemRefs={itemRefs} selectedIds={selectedIds} />
        {children}
        {blog}
        {about}
        {computer}
        {document}
        <StartBar />
        {selection.visible && (
          <SelectionRect
            x={selection.x}
            y={selection.y}
            w={selection.w}
            h={selection.h}
          />
        )}
      </Desktop>

      {/* 드래그 박스 */}
      {selection.visible && (
        <SelectionRect
          x={selection.x}
          y={selection.y}
          w={selection.w}
          h={selection.h}
        />
      )}
    </>
  );
}
