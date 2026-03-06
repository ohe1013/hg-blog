"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import Button from "@lib/components/Button";
import { launchTarget, normalizeRunCommand } from "@lib/utils/launcher";
import {
  Window,
  WindowBody,
  WindowMenuBar,
  WindowResizeHeader,
} from "@features/window/components";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";

interface RunDialogWindowProps {
  winId: string;
}

export default function RunDialogWindow({ winId }: RunDialogWindowProps) {
  const { getById, close, open } = useApplicationStore((s) => s);
  const win = getById(winId);
  const [command, setCommand] = useState("");
  const [error, setError] = useState<string | null>(null);

  const executeCommand = useCallback(() => {
    const normalized = normalizeRunCommand(command);
    if (!normalized) {
      setError("Please type a program, folder, document, or command.");
      return;
    }
    const commandAlias = normalized.split(" ")[0];

    const result = launchTarget(normalized, { open });
    if (!result.ok) {
      setError(result.message);
      return;
    }

    setError(null);
    setCommand("");
    if (commandAlias !== "run") {
      close(winId);
    }
  }, [close, command, open, winId]);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      executeCommand();
    },
    [executeCommand],
  );

  const menus = useMemo(
    () => [
      {
        label: "File",
        key: "file",
        items: [
          { label: "Run", onClick: executeCommand },
          { label: "Close", onClick: () => close(winId) },
        ],
      },
      {
        label: "Help",
        key: "help",
        items: [{ label: "Run Help", disabled: true }],
      },
    ],
    [close, executeCommand, winId],
  );

  if (!win) return null;

  return (
    <Window
      winId={winId}
      initialWidth="420px"
      initialHeight="220px"
      initialX="18%"
      initialY="18%"
    >
      <WindowResizeHeader />
      <WindowMenuBar menus={menus} />
      <WindowBody
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "16px",
          gap: "12px",
          overflow: "hidden",
        }}
      >
        <p className="text-xs leading-4">
          Type the name of a program, folder, document, or command, and Windows
          will open it for you.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <div className="field-row-stacked">
            <label htmlFor={`run-command-${winId}`}>Open:</label>
            <input
              id={`run-command-${winId}`}
              type="text"
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              placeholder="e.g. articles, about, cmd, notepad"
              autoFocus
            />
          </div>

          {error && <p className="text-xs text-red-700">{error}</p>}

          <div className="ml-auto flex gap-2">
            <Button type="submit">OK</Button>
            <Button type="button" onClick={() => close(winId)}>
              Cancel
            </Button>
            <Button type="button" disabled>
              Browse...
            </Button>
          </div>
        </form>
      </WindowBody>
    </Window>
  );
}
