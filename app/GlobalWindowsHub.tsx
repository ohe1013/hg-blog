"use client";

import { ComponentType, memo, useMemo, useRef } from "react";
import { useApplicationStore } from "../zustand/application/applicationProvider";
import {
  AppsType,
  WindowInstance,
} from "../zustand/application/applicationStore";
import ArticleWindow from "./article/ClienArticleLayout";
import AboutWindow from "./about/ClientAboutLayout";
import ComputerWindow from "./computer/ClientComputerLayout";
import DocumentWindow from "./document/ClientDocumentLayout";

// --- 각 앱의 내용 컴포넌트 매핑(임시) ---
// 실제 구현된 컴포넌트로 교체해줘. props는 자유롭게 맞추면 돼.

import NotepadWindow from "@features/notepad/components/NotepadWindow";
import ArticleViewerWindow from "@features/article/components/ArticleViewerWindow";
import ExternalLinkConfirmWindow from "@features/desktop/components/ExternalLinkConfirmWindow";

export function GlobalWindowsHub() {
  const { windows } = useApplicationStore((s) => s);
  return (
    <>
      {windows.map((w) => {
        if (w.app === "articles")
          return <ArticleWindow key={w.id} winId={w.id} />;
        if (w.app === "about") return <AboutWindow key={w.id} winId={w.id} />;
        if (w.app === "computer")
          return <ComputerWindow key={w.id} winId={w.id} />;
        if (w.app === "document")
          return <DocumentWindow key={w.id} winId={w.id} />;
        if (w.app === "notepad")
          return <NotepadWindow key={w.id} winId={w.id} />;
        if (w.app === "article-viewer")
          return <ArticleViewerWindow key={w.id} winId={w.id} />;
        if (w.app === "external-link-confirm")
          return <ExternalLinkConfirmWindow key={w.id} winId={w.id} />;
        return null;
      })}
    </>
  );
}
