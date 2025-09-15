"use client";

import { ComponentType, memo, useMemo, useRef } from "react";
import { useApplicationStore } from "../zustand/application/applicationProvider";
import {
  AppsType,
  WindowInstance,
} from "../zustand/application/applicationStore";
import BlogWindow from "./blog/ClientBlogLayout";

// --- 각 앱의 내용 컴포넌트 매핑(임시) ---
// 실제 구현된 컴포넌트로 교체해줘. props는 자유롭게 맞추면 돼.

const AboutWindow: ComponentType<{ params?: Record<string, any> }> = (p) => (
  <div style={{ padding: 12 }}>
    About Window {p.params?.pageId && `(pageId: ${p.params.pageId})`}
  </div>
);
const ComputerWindow: ComponentType = () => (
  <div style={{ padding: 12 }}>Computer</div>
);
const DocumentWindow: ComponentType = () => (
  <div style={{ padding: 12 }}>Documents</div>
);
const NotepadWindow: ComponentType = () => (
  <div style={{ padding: 12 }}>Notepad</div>
);

const appRenderer: Record<AppsType, ComponentType<any>> = {
  blog: BlogWindow,
  about: AboutWindow,
  computer: ComputerWindow,
  document: DocumentWindow,
  notepad: NotepadWindow,
};

export function GlobalWindowsHub() {
  const { windows } = useApplicationStore((s) => s);

  return (
    <>
      {windows.map((w) => {
        if (w.app === "blog") return <BlogWindow key={w.id} winId={w.id} />;
        // if (w.app === "about") return <AboutWindow key={w.id} winId={w.id} />;
        return null;
      })}
    </>
  );
}
