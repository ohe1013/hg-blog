import { useDragSelect } from "@lib/hooks/useDrag";
import {
  ExplorerGrid,
  ExplorerGridItem,
} from "@features/explorer/components/ExplorerGrid";
import { useState } from "react";

// 하드코딩된 블로그 포스트 리스트
const ARTICLE_POSTS = [
  {
    id: "15d298367c41800f9521c60630713583",
    title: "Hello World",
    iconUrl: "https://win98icons.alexmeub.com/icons/png/notepad-2.png",
  },
  {
    id: "15d298367c41804c8657f2053151871d",
    title: "Second Post",
    iconUrl: "https://win98icons.alexmeub.com/icons/png/notepad-2.png",
  },
];

export default function ArticleFolderView({
  onNavigate,
}: {
  onNavigate: (id: string) => void;
}) {
  const {
    containerRef,
    selection,
    bindMouseDown,
    SelectionRect,
    itemRefs,
    selectedIds,
    setSelectedIds,
  } = useDragSelect<string>();

  const [rows, setRows] = useState(1);

  return (
    <div className="relative w-full h-full bg-white">
      <ExplorerGrid
        containerRef={containerRef}
        onMouseDown={bindMouseDown}
        itemRefs={itemRefs}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        flow="row"
        className="relative w-full h-full p-4"
        gapX={16}
        gapY={16}
        onRowsChange={setRows}
      >
        {ARTICLE_POSTS.map((post) => (
          <div
            key={post.id}
            data-key={post.id}
            ref={(el) => {
              itemRefs.current[post.id] = el;
            }}
          >
            <ArticleGridItem
              label={post.title}
              iconUrl={post.iconUrl}
              selected={selectedIds.has(post.id)}
              onOpen={() => {
                setSelectedIds(new Set());
                onNavigate(post.id);
              }}
            />
          </div>
        ))}
      </ExplorerGrid>
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

function ArticleGridItem({
  label,
  iconUrl,
  selected,
  onOpen,
}: {
  label: string;
  iconUrl: string;
  selected: boolean;
  onOpen: () => void;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-[72px] cursor-pointer p-2 rounded ${
        selected ? "bg-blue-200 bg-opacity-50 border border-blue-300" : ""
      }`}
      onDoubleClick={onOpen}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="w-10 h-10 bg-contain bg-center bg-no-repeat mb-1"
        style={{ backgroundImage: `url(${iconUrl})` }}
      />
      <span className="text-xs text-center line-clamp-2 break-all">
        {label}
      </span>
    </div>
  );
}
