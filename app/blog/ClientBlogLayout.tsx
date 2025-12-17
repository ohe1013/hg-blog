"use client";
import { rootDir } from "@features/notion/data";
import {
  Window,
  WindowAddressBar,
  WindowBody,
  WindowMainBody,
  WindowMenuBar,
  WindowResizeHeader,
  WindowSideBar,
  WindowStatus,
} from "../../features/window/components";
import { useApplicationStore } from "../../zustand/application/applicationProvider";
import BlogSidebar from "./BlogSidebar";
import { Fragment } from "react/jsx-runtime";
import { ExplorerGridContainer } from "@features/explorer/components/ExplorerGrid";
import { useDragSelect } from "@lib/hooks/useDrag";
import { ExplorerProvider } from "@features/explorer/stores/ExplorerContext";

import { BlogPost } from "@features/notion/api";

// 블로그 창 1개 인스턴스를 렌더하는 컴포넌트
export default function BlogWindow({ winId }: { winId: string }) {
  const { getById } = useApplicationStore((s) => s);
  const win = getById(winId);
  if (!win) return null; // 이미 닫혔을 수 있음
  const pageId = win.params?.pageId ?? rootDir.blog;
  const initialPosts = win.params?.initialPosts as BlogPost[] | undefined;

  const {
    containerRef,
    selection,
    bindMouseDown,
    SelectionRect,
    itemRefs,
    selectedIds,
    setSelectedIds,
  } = useDragSelect<string>();
  return (
    <Fragment>
      <ExplorerProvider initialId="blog" initialPosts={initialPosts}>
        <Window winId={winId}>
          <WindowResizeHeader />
          <WindowMenuBar />
          <WindowAddressBar />
          <WindowBody style={{ display: "flex" }}>
            <WindowSideBar>
              <BlogSidebar />
            </WindowSideBar>
            <WindowMainBody>
              <ExplorerGridContainer
                containerRef={containerRef}
                onMouseDown={bindMouseDown}
                itemRefs={itemRefs}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
              />
            </WindowMainBody>
          </WindowBody>
          <WindowStatus />
        </Window>
        {selection.visible && (
          <SelectionRect
            x={selection.x}
            y={selection.y}
            w={selection.w}
            h={selection.h}
          />
        )}
      </ExplorerProvider>
    </Fragment>
  );
}
