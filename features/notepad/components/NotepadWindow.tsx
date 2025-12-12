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
  const { getById, close } = useApplicationStore((s) => s);
  const { fs } = useExplorer();
  const win = getById(winId);
  const [content, setContent] = useState("");

  const fileId = win?.params?.fileId;

  useEffect(() => {
    if (fileId) {
      const saved = sessionStorage.getItem(`notepad_content_${fileId}`);
      if (saved !== null) {
        setContent(saved);
        return;
      }
      const node = fs.byId[fileId];
      if (node && node.kind === "file" && typeof node.payload === "string") {
        setContent(node.payload);
      }
    }
  }, [fileId, fs.byId]);

  const handleSave = () => {
    if (fileId) {
      sessionStorage.setItem(`notepad_content_${fileId}`, content);
    }
  };

  if (!win) return null;

  const menus = [
    {
      label: "File",
      key: "file",
      items: [
        { label: "Save", onClick: handleSave },
        { label: "Close", onClick: () => close(winId) },
      ],
    },
    {
      label: "Edit",
      key: "edit",
      items: [
        { label: "Cut", disabled: true },
        { label: "Copy", disabled: true },
        { label: "Paste", disabled: true },
      ],
    },
    {
      label: "Help",
      key: "help",
      items: [
        { label: "Help Topics", disabled: true },
        { label: "About", disabled: true },
      ],
    },
  ];

  return (
    <Window winId={winId}>
      <WindowResizeHeader />
      <WindowMenuBar menus={menus} />
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
