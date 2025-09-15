"use client";
import {
  Window,
  WindowBody,
  WindowMenuBar,
  WindowResizeHeader,
  WindowStatus,
} from "../../features/window/components";
import { useApplicationStore } from "../../zustand/application/applicationProvider";
import BlogView from "@features/blog/BlogView";

// 블로그 창 1개 인스턴스를 렌더하는 컴포넌트
export default function BlogWindow({ winId }: { winId: string }) {
  const { getById } = useApplicationStore((s) => s);
  const win = getById(winId);
  if (!win) return null; // 이미 닫혔을 수 있음
  const pageId = (win?.params?.pageId as string) ?? ""; // 없으면 기본값

  // 필요하면 params에서 pageId 꺼내서 콘텐츠 렌더
  // const pageId = win.params?.pageId ?? rootDir.blog;

  return (
    <Window winId={winId}>
      <WindowResizeHeader />
      <WindowMenuBar />
      <WindowBody>
        <BlogView params={{ pageId }} />
      </WindowBody>
      <WindowStatus />
    </Window>
  );
}
