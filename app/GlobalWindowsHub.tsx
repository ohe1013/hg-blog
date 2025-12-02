"use client";

import { ComponentType, memo, useMemo, useRef } from "react";
import { useApplicationStore } from "../zustand/application/applicationProvider";
import {
  AppsType,
  WindowInstance,
} from "../zustand/application/applicationStore";
import BlogWindow from "./blog/ClientBlogLayout";
import AboutWindow from "./about/ClientAboutLayout";
import ComputerWindow from "./computer/ClientComputerLayout";

// --- 각 앱의 내용 컴포넌트 매핑(임시) ---
// 실제 구현된 컴포넌트로 교체해줘. props는 자유롭게 맞추면 돼.

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
        if (w.app === "about") return <AboutWindow key={w.id} winId={w.id} />;
        if (w.app === "computer") return <ComputerWindow key={w.id} winId={w.id} />;
        return null;
      })}
    </>
  );
}
