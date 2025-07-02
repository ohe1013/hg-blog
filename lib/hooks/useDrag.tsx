import { useEffect, useRef, useState } from "react";

interface SelectionBox {
  visible: boolean;
  startX: number;
  startY: number;
  x: number;
  y: number;
  w: number;
  h: number;
}
interface SelectionRectProps {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function useDragSelect<T extends string>() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<T, HTMLDivElement | null>>(
    {} as Record<T, HTMLDivElement>
  );
  const [selection, setSelection] = useState<SelectionBox>({
    visible: false,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });
  const [selectedIds, setSelectedIds] = useState<Set<T>>(new Set());

  // 마우스 이동 & 업 이벤트
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!selection.visible) return;
      const { startX, startY } = selection;
      const rawX = Math.min(startX, e.clientX);
      const rawY = Math.min(startY, e.clientY);
      const rawW = Math.abs(e.clientX - startX);
      const rawH = Math.abs(e.clientY - startY);
      const box = containerRef.current!.getBoundingClientRect();
      // clamp x,y 사이즈를 container 내부로 제한
      let w = 0;
      let h = 0;
      const x = Math.max(box.left, rawX);
      const y = Math.max(box.top, rawY);
      if (e.clientX < startX) {
        w = Math.min(startX - box.left, rawW, box.right - x);
      } else {
        w = Math.min(rawW, box.right - x);
      }
      if (e.clientY < startY) {
        h = Math.min(startY - box.top, rawH, box.bottom - y);
      } else {
        h = Math.min(rawH, box.bottom - y);
      }

      setSelection((sel) => ({ ...sel, x, y, w, h }));

      // 충돌 검사
      const hit = new Set<T>();
      for (const [key, el] of Object.entries(itemRefs.current) as [
        T,
        HTMLElement
      ][]) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.left < x + w && r.right > x && r.top < y + h && r.bottom > y) {
          hit.add(key);
        }
      }
      setSelectedIds(hit);
    }

    function onMouseUp() {
      setSelection((sel) => ({ ...sel, visible: false }));
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    if (selection.visible) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [selection.visible]);

  // 드래그 시작 핸들러
  const bindMouseDown = (e: React.MouseEvent) => {
    // 바탕화면(컨테이너) 외부, 즉 아이콘 위에서 클릭하면 드래그를 시작하지 않는다

    if (e.target === containerRef.current) {
      // 빈 공간 클릭 → 기존 선택 초기화 후 드래그 시작
      setSelectedIds(new Set());
      setSelection({
        visible: true,
        startX: e.clientX,
        startY: e.clientY,
        x: e.clientX,
        y: e.clientY,
        w: 0,
        h: 0,
      });
    } else {
      // 아이콘 위 클릭 → 드래그 로직을 막고, 그 아이콘만 선택
      const iconDiv = (e.target as HTMLElement).closest(
        "[data-key]"
      ) as HTMLElement;
      if (iconDiv) {
        const key = iconDiv.dataset.key! as T;
        setSelectedIds(new Set([key]));
      }
    }
  };
  const SelectionRect: React.FC<SelectionRectProps> = ({ x, y, w, h }) => {
    return (
      <div
        className="selection-rect"
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: h,
          border: "1px dotted rgb(185, 185, 185)",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    );
  };

  return {
    containerRef,
    itemRefs,
    selection,
    selectedIds,
    bindMouseDown,
    SelectionRect,
  };
}
