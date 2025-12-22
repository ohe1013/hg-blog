"use client";
import { useEffect, useState } from "react";
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
import { FileNode } from "@features/fs/types";

interface BlogViewerWindowProps {
  winId: string;
}

export default function BlogViewerWindow({ winId }: BlogViewerWindowProps) {
  const win = useApplicationStore((s) => s.getById(winId));
  const [recordMap, setRecordMap] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fileId = win?.params?.fileId;
  const paramPageId = win?.params?.pageId;
  const initialNode = fileId ? initialFs.byId[fileId] : null;
  const initialPageId =
    (initialNode?.kind === "file" ? initialNode.pageId : null) ?? paramPageId;

  const [activePageId, setActivePageId] = useState<string | null>(
    initialPageId ?? null
  );

  useEffect(() => {
    if (activePageId) {
      setLoading(true);

      fetch(`/api/notion/page/${activePageId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch");
          return res.json();
        })
        .then((data) => {
          setRecordMap(data.recordMap);
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
        {loading && <div className="p-4">Loading...</div>}
        {!loading && recordMap && (
          <div className="h-full overflow-y-auto">
            <Renderer
              recordMap={recordMap}
              rootPageId={activePageId}
              rootUrl="blog"
              onNavigate={(id) => setActivePageId(id)}
            />
          </div>
        )}
      </WindowBody>
      <WindowStatus />
    </Window>
  );
}
