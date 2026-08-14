"use client";
import { useCallback, useEffect, useState } from "react";
import {
  Window,
  WindowBody,
  WindowMenuBar,
  WindowResizeHeader,
  WindowStatus,
} from "../../window/components";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import Renderer from "@features/notion/Renderer";
import { initialFs } from "@features/fs/data/initialFs";
import { fetchNotionRecordMap } from "@features/notion/api";
import { shouldFetchNotionPage } from "@features/notion/viewerState";
import ArticleCommentsPanel from "./ArticleCommentsPanel";

interface ArticleViewerWindowProps {
  winId: string;
}

export default function ArticleViewerWindow({
  winId,
}: ArticleViewerWindowProps) {
  const win = useApplicationStore((s) => s.getById(winId));

  const fileId = win?.params?.fileId;
  const paramPageId = win?.params?.pageId;
  const initialNode = fileId ? initialFs.byId[fileId] : null;
  const initialPageId =
    (initialNode?.kind === "file" ? initialNode.pageId : null) ?? paramPageId;
  const initialRecordMap = win?.params?.initialRecordMap;
  const rootUrl = win?.params?.rootUrl === "about" ? "about" : "article";
  const [recordMap, setRecordMap] = useState<any>(initialRecordMap ?? null);
  const [loadedPageId, setLoadedPageId] = useState<string | null>(
    initialRecordMap ? (initialPageId ?? null) : null,
  );
  const [loading, setLoading] = useState(false);

  const [activePageId, setActivePageId] = useState<string | null>(
    initialPageId ?? null,
  );

  const handleNavigate = useCallback((id: string) => {
    setActivePageId(id);
  }, []);

  useEffect(() => {
    if (
      !activePageId ||
      !shouldFetchNotionPage(activePageId, loadedPageId)
    )
      return;
    setLoading(true);
    fetchNotionRecordMap(activePageId)
      .then((nextRecordMap) => {
        setRecordMap(nextRecordMap);
        setLoadedPageId(activePageId);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [activePageId, loadedPageId]);

  if (!win || !activePageId) return null;

  return (
    <Window winId={winId}>
      <WindowResizeHeader />
      <WindowMenuBar />
      <WindowBody
        style={{
          display: "flex",
          flexDirection: "column",
          background: "white",
        }}
      >
        {/* {loading && <div className="p-4">Loading...</div>} */}
        {!loading && recordMap && (
          <div className="h-full overflow-y-auto">
            <Renderer
              recordMap={recordMap}
              rootPageId={activePageId}
              rootUrl={rootUrl}
              onNavigate={handleNavigate}
            />
            <ArticleCommentsPanel pageId={activePageId} />
          </div>
        )}
      </WindowBody>
      <WindowStatus />
    </Window>
  );
}
