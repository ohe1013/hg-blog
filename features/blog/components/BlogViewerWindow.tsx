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
  const { getById } = useApplicationStore((s) => s);
  const fs = initialFs;
  const win = getById(winId);
  const [recordMap, setRecordMap] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fileId = win?.params?.fileId;
  const node = fs.byId[fileId];
  if (node.kind === "folder") return;
  const pageId = node.pageId;
  useEffect(() => {
    if (fileId) {
      setLoading(true);

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
  }, [fileId]);

  if (!win || !pageId) return null;

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
