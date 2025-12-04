import { handleGridNavigation } from "@lib/utils/keyboard";
import React from "react";

interface UseGridNavigationProps {
  rows: number;
  keys: string[];
  itemRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  selectedIds: Set<string>;
  setSelectedIds: (ids: Set<string>) => void;
  items: { id: string; name: string }[];
  rowType?: "row" | "col";
}

export const useGridNavigation = ({
  rows,
  keys,
  itemRefs,
  selectedIds,
  setSelectedIds,
  items,
  rowType = "row",
}: UseGridNavigationProps) => {
  const handleContainerKeyDown = (e: React.KeyboardEvent) => {
    // 1. Determine start index
    // Try to find the item that triggered the event (if focus is on an item)
    let startIndex = -1;
    const target = e.target as HTMLElement;
    const keyAttr = target.getAttribute("data-key");

    if (keyAttr) {
      startIndex = keys.indexOf(keyAttr);
    }

    // If no specific item is focused (or found), try the first selected item
    if (startIndex === -1 && selectedIds.size > 0) {
      const firstSelected = keys.find((k) => selectedIds.has(k));
      if (firstSelected) {
        startIndex = keys.indexOf(firstSelected);
      }
    }

    // If still nothing, start from -1 (so next is 0) or 0
    if (startIndex === -1) startIndex = 0;

    handleGridNavigation(
      e,
      startIndex,
      rows,
      keys,
      itemRefs,
      rowType,
      setSelectedIds
    );

    if (e.defaultPrevented) return;

    if (e.key.length === 1) {
      const char = e.key.toLowerCase();
      const sortedItems = items.map((item, i) => ({
        name: item.name,
        id: item.id,
        index: i,
      }));

      // Search after current index
      let nextItem = sortedItems
        .slice(startIndex + 1)
        .find((c) => c.name.toLowerCase().startsWith(char));

      // Wrap around
      if (!nextItem) {
        nextItem = sortedItems
          .slice(0, startIndex + 1)
          .find((c) => c.name.toLowerCase().startsWith(char));
      }

      if (nextItem) {
        e.preventDefault();
        const nextKey = nextItem.id;
        itemRefs.current[nextKey]
          ?.querySelector<HTMLElement>("[tabindex]")
          ?.focus();
        setSelectedIds(new Set([nextKey]));
      }
    }
  };

  return { handleContainerKeyDown };
};
