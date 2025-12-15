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
import BlogView from "@features/blog/BlogView";

import BlogFolderView from "@features/blog/BlogFolderView";
import BlogSidebar from "./BlogSidebar";

// 블로그 창 1개 인스턴스를 렌더하는 컴포넌트
export default function BlogWindow({ winId }: { winId: string }) {
  const { getById, updateParams } = useApplicationStore((s) => s);
  const win = getById(winId);
  if (!win) return null; // 이미 닫혔을 수 있음
  const pageId = win.params?.pageId ?? rootDir.blog;
  console.log(pageId, rootDir.blog);
  return (
    <Window winId={winId}>
      <WindowResizeHeader />
      <WindowMenuBar />
      <WindowAddressBar />
      <WindowBody style={{ display: "flex" }}>
        <WindowSideBar>
          <BlogSidebar />
        </WindowSideBar>
        <WindowMainBody>
          {pageId === rootDir.blog ? (
            <BlogFolderView
              onNavigate={(nextId) => updateParams(winId, { pageId: nextId })}
            />
          ) : (
            <BlogView
              pageId={pageId}
              onNavigate={(nextId) => updateParams(winId, { pageId: nextId })}
              initialRecordMap={win.initialData}
            />
          )}
        </WindowMainBody>
      </WindowBody>
      <WindowStatus />
    </Window>
  );
}
