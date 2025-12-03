"use client";
import React from "react";

import { useDragSelect } from "@lib/hooks/useDrag";
import { DesktopIconGrid } from ".";
import { StartBar } from "@features/startBar/components";
import { AppsType } from "../../../zustand/application/applicationStore";

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
    setSelectedIds,
  } = useDragSelect<AppsType>();

  return (
    <>
      {/* <DesktopGrid containerRef={containerRef} onMouseDown={bindMouseDown}> */}
      <DesktopIconGrid
        containerRef={containerRef}
        onMouseDown={bindMouseDown}
        itemRefs={itemRefs}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />
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
      {/* </Desktop> */}
    </>
  );
}
