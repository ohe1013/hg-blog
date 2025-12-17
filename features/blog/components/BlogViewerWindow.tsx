import React, { useEffect, useState } from "react";
import { NotionAPI } from "notion-client";
import {
  Window,
  WindowBody,
  WindowMenuBar,
  WindowResizeHeader,
  WindowStatus,
} from "../../window/components";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import Renderer from "@features/notion/Renderer";

interface BlogViewerWindowProps {
  winId: string;
}

export default function BlogViewerWindow({ winId }: BlogViewerWindowProps) {
  const { getById, close } = useApplicationStore((s) => s);
  const win = getById(winId);
  const [recordMap, setRecordMap] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const pageId = win?.params?.pageId;

  useEffect(() => {
    if (pageId) {
      setLoading(true);
      // Client-side fetch for now, ideally we'd have a proxy API or use server actions
      // But notion-client is node-only usually.
      // We might need an API route to proxy this request if notion-client doesn't work in browser.
      // For this demo, let's assume we have an API route /api/notion/[pageId]

      fetch(`/api/notion/${pageId}`)
        .then((res) => res.json())
        .then((data) => {
          setRecordMap(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [pageId]);

  if (!win) return null;

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
            <Renderer recordMap={recordMap} rootPageId={pageId} rootUrl="" />
          </div>
        )}
      </WindowBody>
      <WindowStatus />
    </Window>
  );
}
