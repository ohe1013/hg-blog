"use client";
import { Ref, useLayoutEffect, useRef, useState } from "react";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import "../styles/index.scss";
import { AppsType } from "../../../zustand/application/applicationStore";
import { useGridNavigation } from "@lib/hooks/useGridNavigation";

type DesktopGridProps = {
  containerRef: Ref<HTMLDivElement>;
  onMouseDown: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
  // 방향: row = 가로 우선, col = 세로 우선
  flow?: "row" | "col";
  // 타일 사이즈/간격(필요 시 조정)
  tileWidth?: number; // 72
  tileHeight?: number; // 80
  gapX?: number; // 16 (Tailwind gap-x-4 기준)
  gapY?: number; // 8  (Tailwind gap-y-2 기준)
  onRowsChange?: (rows: number) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
};

function DesktopGrid({
  containerRef,
  onMouseDown,
  children,
  className,
  flow = "col", // 기본: 세로 우선 (Windows 바탕화면 느낌)
  tileWidth = 72,
  tileHeight = 60,
  gapX = 16,
  gapY = 8,
  onRowsChange,
  onKeyDown,
}: DesktopGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState(1); // 세로 우선일 때 필요한 행 수

  useLayoutEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    // grid 컨테이너 높이 기반으로 "몇 행" 들어갈지 계산
    const ro = new ResizeObserver(() => {
      const h = el.clientHeight;
      // 간격 포함해서 계산 (대략적으로 맞춤)
      const perRow = tileHeight + gapY;
      const count = Math.max(1, Math.floor((h + gapY) / perRow));
      setRows(count);
      onRowsChange?.(count);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [tileHeight, gapY]);

  const flowStyles =
    flow === "row"
      ? {
          // 가로 우선: 열은 auto-fill, 행은 자동 높이
          gridAutoFlow: "row" as const,
          gridTemplateColumns: `repeat(auto-fill, ${tileWidth}px)`,
          gridAutoRows: `${tileHeight}px`,
        }
      : {
          // 세로 우선: 필수!
          gridAutoFlow: "column" as const,
          gridAutoColumns: `${tileWidth}px`,
          gridTemplateRows: `repeat(${rows}, ${tileHeight}px)`,
        };

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => {
        onMouseDown(e);
        // 빈 공간 클릭 시 컨테이너에 포커스 강제
        const target = e.target as HTMLElement;
        if (!target.closest("[data-key]")) {
          (e.currentTarget as HTMLElement).focus({ preventScroll: true });
        }
      }}
      onKeyDown={onKeyDown}
      tabIndex={0}
      className={
        className ?? "absolute inset-0 h-dvh w-full overflow-hidden bg-teal-600"
      }
    >
      {/* 내부 grid는 부모 높이를 꽉 채워야 높이 측정이 가능함 */}
      <div
        ref={gridRef}
        className="h-full"
        style={{
          display: "grid",
          gap: `${gapY}px ${gapX}px`,
          padding: "8px",
          ...flowStyles,
        }}
      >
        {children}
      </div>
    </div>
  );
}

type ItemProps = {
  label: string;
  iconUrl: string;
  selected?: boolean;
  onOpen?: () => void; // 더블클릭/Enter
  onFocus?: () => void;
  onBlur?: () => void;
};

function DesktopGridItem({
  label,
  iconUrl,
  selected = false,
  onOpen,
  onFocus,
  onBlur,
}: ItemProps) {
  const [isFocus, setIsFocus] = useState(false);
  const active = isFocus || selected;

  const handleEnterOrSpace = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-selected={active}
      aria-label={label}
      onFocus={(e) => {
        setIsFocus(true);
        onFocus?.();
      }}
      onBlur={(e) => {
        setIsFocus(false);
        onBlur?.();
      }}
      onDoubleClick={() => onOpen?.()}
      onClick={(e) => {
        e.currentTarget.focus();
      }}
      onKeyDown={handleEnterOrSpace}
      className={`text-center w-[72px] leading-3 py-2 px-[1px] outline-none ${
        active ? "active" : ""
      }`}
    >
      <div className="box-border">
        <div className="DesktopIcon__wrapper">
          <div
            className="DesktopIcon__item"
            style={{ backgroundImage: `url(${iconUrl})` }}
          />
          <div
            className={`DesktopIcon__item ${active ? "actived" : ""}`}
            style={{ maskImage: `url(${iconUrl})`, maskSize: "contain" }}
          />
        </div>
        <span className={`DesktopIcon__text ${active ? "actived" : ""}`}>
          {label}
        </span>
      </div>
    </div>
  );
}
type DesktopIconGridProps = {
  itemRefs: React.MutableRefObject<Record<AppsType, HTMLDivElement | null>>;
  selectedIds: Set<AppsType>;
  containerRef: React.Ref<HTMLDivElement>;
  onMouseDown: (e: React.MouseEvent) => void;
  setSelectedIds?: (ids: Set<AppsType>) => void;
};

function DesktopIconGrid({
  itemRefs,
  selectedIds,
  containerRef,
  onMouseDown,
  setSelectedIds,
}: DesktopIconGridProps) {
  const [rows, setRows] = useState(1);
  const appStore = useApplicationStore((s) => s);
  // 앱 키들 중 바탕화면에 표시할 것만
  const keys = appStore
    .getApplicationKeys()
    .filter((k) => appStore.apps[k]?.showOnDesktop);

  const handleOpen = (key: AppsType) => {
    const app = appStore.apps[key];
    if (app.externalUrl) {
      alert(`[${app.label}] 외부 링크로 이동합니다.\n주소: ${app.externalUrl}`);
      window.open(app.externalUrl, "_blank");
      return;
    }
    // 필요하면 params 넘기기: appStore.open('blog', { pageId: '...' })
    appStore.open(key);
  };

  const { handleContainerKeyDown } = useGridNavigation({
    rows,
    keys,
    itemRefs,
    selectedIds: selectedIds as Set<string>,
    setSelectedIds: setSelectedIds as any,
    items: keys.map((k) => ({ id: k, name: appStore.apps[k].label })),
    rowType: "col",
  });

  return (
    <DesktopGrid
      containerRef={containerRef}
      onMouseDown={onMouseDown}
      onRowsChange={setRows}
      onKeyDown={handleContainerKeyDown}
    >
      {keys.map((key, index) => {
        const app = appStore.apps[key];
        return (
          <div
            key={key}
            data-key={key}
            ref={(el) => {
              itemRefs.current[key] = el;
            }}
          >
            <DesktopGridItem
              label={app.label}
              iconUrl={app.iconUrl}
              selected={selectedIds.has(key)}
              onOpen={() => handleOpen(key)}
            />
          </div>
        );
      })}
    </DesktopGrid>
  );
}
export { DesktopIconGrid, DesktopGrid, DesktopGridItem };
