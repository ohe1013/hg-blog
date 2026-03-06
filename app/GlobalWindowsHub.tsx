"use client";

import { useApplicationStore } from "../zustand/application/applicationProvider";
import ArticleWindow from "./article/ClienArticleLayout";
import AboutWindow from "./about/ClientAboutLayout";
import ComputerWindow from "./computer/ClientComputerLayout";
import DocumentWindow from "./document/ClientDocumentLayout";

// --- 각 앱의 내용 컴포넌트 매핑(임시) ---
// 실제 구현된 컴포넌트로 교체해줘. props는 자유롭게 맞추면 돼.

import NotepadWindow from "@features/notepad/components/NotepadWindow";
import ArticleViewerWindow from "@features/article/components/ArticleViewerWindow";
import ExternalLinkConfirmWindow from "@features/desktop/components/ExternalLinkConfirmWindow";
import GuestbookWindow from "@features/guestbook/components/GuestbookWindow";
import ContactWindow from "@features/contact/components/ContactWindow";
import RunDialogWindow from "@features/startBar/components/RunDialogWindow";
import DosPromptWindow from "@features/startBar/components/DosPromptWindow";
import RecycleBinWindow from "@features/startBar/components/RecycleBinWindow";
import type { SystemAppKey } from "@features/explorer/data";

const WINDOW_RENDERERS: Partial<
  Record<SystemAppKey, (winId: string) => JSX.Element>
> = {
  articles: (winId) => <ArticleWindow key={winId} winId={winId} />,
  about: (winId) => <AboutWindow key={winId} winId={winId} />,
  computer: (winId) => <ComputerWindow key={winId} winId={winId} />,
  document: (winId) => <DocumentWindow key={winId} winId={winId} />,
  notepad: (winId) => <NotepadWindow key={winId} winId={winId} />,
  "article-viewer": (winId) => (
    <ArticleViewerWindow key={winId} winId={winId} />
  ),
  "external-link-confirm": (winId) => (
    <ExternalLinkConfirmWindow key={winId} winId={winId} />
  ),
  guestbook: (winId) => <GuestbookWindow key={winId} winId={winId} />,
  contact: (winId) => <ContactWindow key={winId} winId={winId} />,
  "run-dialog": (winId) => <RunDialogWindow key={winId} winId={winId} />,
  "dos-prompt": (winId) => <DosPromptWindow key={winId} winId={winId} />,
  "recycle-bin": (winId) => <RecycleBinWindow key={winId} winId={winId} />,
};

export function GlobalWindowsHub() {
  const { windows } = useApplicationStore((s) => s);
  return (
    <>
      {windows.map((w) => {
        const renderer = WINDOW_RENDERERS[w.app as SystemAppKey];
        return renderer ? renderer(w.id) : null;
      })}
    </>
  );
}
