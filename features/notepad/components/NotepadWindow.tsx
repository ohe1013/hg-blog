import React, { useEffect, useState } from "react";
import {
  Window,
  WindowBody,
  WindowMenuBar,
  WindowResizeHeader,
  WindowStatus,
} from "../../window/components";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import { useExplorer } from "../../explorer/stores/fileExplorer";

interface NotepadWindowProps {
  winId: string;
}

export default function NotepadWindow({ winId }: NotepadWindowProps) {
  const { getById } = useApplicationStore((s) => s);
  const { fs } = useExplorer();
  const win = getById(winId);
  const [content, setContent] = useState("");

  const fileId = win?.params?.fileId;

  useEffect(() => {
    if (fileId) {
      const node = fs.byId[fileId];
      if (node && node.kind === "file" && typeof node.payload === "string") {
        setContent(node.payload);
      }
    }
  }, [fileId, fs.byId]);

  if (!win) return null;

  return (
    <Window winId={winId}>
      <WindowResizeHeader />
      <WindowMenuBar />
      <WindowBody style={{ display: "flex", flexDirection: "column" }}>
        <textarea
          className="w-full h-full resize-none outline-none p-1 font-mono text-sm"
          style={{ border: "none", flexGrow: 1 }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          spellCheck={false}
        />
      </WindowBody>
      <WindowStatus />
    </Window>
  );
}
