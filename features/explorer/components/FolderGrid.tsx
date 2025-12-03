import { useExplorer } from "../stores/fileExplorer";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import { handleGridNavigation } from "@lib/utils/keyboard";
import { Ref, useLayoutEffect, useRef, useState } from "react";
import "../styles/index.scss";

interface FolderGridContainerProps {
  containerRef: React.Ref<HTMLDivElement>;
  onMouseDown: (e: React.MouseEvent) => void;
  itemRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  selectedIds: Set<string>;
  setSelectedIds: (ids: Set<string>) => void;
}

export const FolderGridContainer = ({
  containerRef,
  onMouseDown,
  itemRefs,
  selectedIds,
  setSelectedIds,
}: FolderGridContainerProps) => {
  const { fs, currentId, open } = useExplorer();
  const { open: openApp } = useApplicationStore((s) => s);
  const [rows, setRows] = useState(1);
  const cur = fs.byId[currentId];

  if (!cur || cur.kind !== "folder") return null;

  const children = cur.children.map((id) => fs.byId[id]).filter(Boolean);
  const keys = children.map((c) => c.id);

  const handleOpen = (id: string) => {
    const node = fs.byId[id];
    if (!node) return;
    if (node.kind === "folder") {
      open(id);
    } else {
      // 파일이면 앱 실행 (여기서는 notepad로 가정하거나, node.app 사용)
      // sampleFs에 app 필드가 있으므로 그것을 활용
      const appKey =
        node.app === "markdown-viewer" || node.app === "text-viewer"
          ? "notepad"
          : (node.app as any);

      // 임시: 이미지 뷰어 등은 아직 없으므로 텍스트 계열만 notepad로 연결
      if (appKey === "notepad") {
        openApp("notepad", { fileId: id });
      } else {
        console.warn("No app for", node.app);
      }
    }
  };

  return (
    <FolderGrid
      containerRef={containerRef}
      onMouseDown={onMouseDown}
      flow="row"
      className="relative w-full h-full"
      gapX={0}
      gapY={0}
      onRowsChange={setRows}
    >
      {children.map((node, index) => (
        <div
          key={node.id}
          data-key={node.id}
          ref={(el) => {
            itemRefs.current[node.id] = el;
          }}
          onKeyDown={(e) =>
            handleGridNavigation(
              e,
              index,
              rows,
              keys,
              itemRefs,
              "row",
              setSelectedIds
            )
          }
        >
          <FolderGridItem
            label={node.name}
            iconUrl={node.iconUrl}
            selected={selectedIds.has(node.id)}
            onOpen={() => handleOpen(node.id)}
          />
        </div>
      ))}
    </FolderGrid>
  );
};
type FolderGridProps = {
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
};
function FolderGrid({
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
}: FolderGridProps) {
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
      onMouseDown={onMouseDown}
      className={
        className ?? "absolute inset-0 h-dvh w-full overflow-hidden bg-teal-600"
      }
    >
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

function FolderGridItem({
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
        <div className="FolderGrid__wrapper">
          <div
            className="FolderGrid__item"
            style={{ backgroundImage: `url(${iconUrl})` }}
          />
          <div
            className={`FolderGrid__item ${active ? "actived" : ""}`}
            style={{ maskImage: `url(${iconUrl})`, maskSize: "contain" }}
          />
        </div>
        <span className={`FolderGrid__text ${active ? "actived" : ""}`}>
          {label}
        </span>
      </div>
    </div>
  );
}
