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
import ArticleCommentsPanel from "./ArticleCommentsPanel";

interface ArticleViewerWindowProps {
  winId: string;
}

export default function ArticleViewerWindow({
  winId,
}: ArticleViewerWindowProps) {
  const win = useApplicationStore((s) => s.getById(winId));
  const [recordMap, setRecordMap] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fileId = win?.params?.fileId;
  const paramPageId = win?.params?.pageId;
  const initialNode = fileId ? initialFs.byId[fileId] : null;
  const initialPageId =
    (initialNode?.kind === "file" ? initialNode.pageId : null) ?? paramPageId;

  const [activePageId, setActivePageId] = useState<string | null>(
    initialPageId ?? null,
  );

  const handleNavigate = useCallback((id: string) => {
    setActivePageId(id);
  }, []);

  useEffect(() => {
    if (activePageId) {
      setLoading(true);

      fetchNotionRecordMap(activePageId)
        .then((recordMap) => {
          setRecordMap(recordMap);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [activePageId]);

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
              rootUrl="article"
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
