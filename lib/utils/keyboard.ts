import React from "react";

export const handleGridNavigation = (
  e: React.KeyboardEvent,
  currentIndex: number,
  row: number,
  keys: string[],
  itemRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>,
  rowType: "row" | "col" = "row",
  setSelectedIds?: (ids: Set<string>) => void
) => {
  const { key } = e;
  let nextIndex = currentIndex;

  if (rowType === "row") {
    if (key === "ArrowUp") {
      nextIndex = currentIndex - row;
    } else if (key === "ArrowDown") {
      nextIndex = currentIndex + row;
    } else if (key === "ArrowLeft") {
      nextIndex = currentIndex - 1;
    } else if (key === "ArrowRight") {
      nextIndex = currentIndex + 1;
    } else {
      return;
    }
  } else {
    if (key === "ArrowUp") {
      nextIndex = currentIndex - 1;
    } else if (key === "ArrowDown") {
      nextIndex = currentIndex + 1;
    } else if (key === "ArrowLeft") {
      nextIndex = currentIndex - row;
    } else if (key === "ArrowRight") {
      nextIndex = currentIndex + row;
    } else {
      return;
    }
  }
  // 범위 체크
  if (nextIndex >= 0 && nextIndex < keys.length) {
    e.preventDefault();
    const nextKey = keys[nextIndex];
    // 포커스 이동
    itemRefs.current[nextKey]
      ?.querySelector<HTMLElement>("[tabindex]")
      ?.focus();
    // 선택 업데이트
    setSelectedIds?.(new Set([nextKey]));
  }
};
