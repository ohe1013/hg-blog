"use client";
import { rootDir } from "@features/notion/data";
import {
  Window,
  WindowBody,
  WindowMenuBar,
  WindowResizeHeader,
  WindowStatus,
} from "../../features/window/components";
import { useApplicationStore } from "../../zustand/application/applicationProvider";
import AboutView from "@features/about/AboutView";

// 블로그 창 1개 인스턴스를 렌더하는 컴포넌트
export default function AboutWindow({ winId }: { winId: string }) {
  const { getById, updateParams } = useApplicationStore((s) => s);
  const win = getById(winId);
  if (!win) return null; // 이미 닫혔을 수 있음
  const pageId = win.params?.pageId ?? rootDir.about;

  return (
    <Window winId={winId}>
      <WindowResizeHeader />
      <WindowMenuBar />
      <WindowBody style={{ display: "block" }}>
        <AboutView
          pageId={pageId}
          onNavigate={(nextId) => updateParams(winId, { pageId: nextId })}
        />
      </WindowBody>
      <WindowStatus />
    </Window>
  );
}
