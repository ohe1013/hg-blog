"use client";
import React, { ReactNode } from "react";
import { AddressBar } from "./AddressBar";
import { FileGrid } from "./FileGrid";
import { useFileExplorerStore } from "../../../zustand/file/fileExplore";

type Props = { children?: ReactNode };

export default function ExplorerLayout({ children }: Props) {
  const { resetToRoot } = useFileExplorerStore();
  // 필요하면 goBack, goForward 등도 받아오세요

  // children 자리에 page-level 추가 UI(예: 상세 뷰) 넣을 수 있습니다.
  return (
    <div style={{ left: "30%", width: "70%", position: "absolute" }}>
      <AddressBar />
      <FileGrid />
      {children}
    </div>
  );
}
