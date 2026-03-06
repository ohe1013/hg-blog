"use client";

import { FormEvent, KeyboardEvent, useCallback, useRef, useState } from "react";
import { initialFs } from "@features/fs/data/initialFs";
import { FolderNode } from "@features/fs/types";
import { launchTarget, normalizeRunCommand } from "@lib/utils/launcher";
import {
  Window,
  WindowBody,
  WindowResizeHeader,
} from "@features/window/components";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";

interface DosPromptWindowProps {
  winId: string;
}

type CwdId = string | null;

const VERSION_TEXT = "Microsoft(R) Windows 98 [Version 4.10.2222]";
const HELP_TEXT =
  "Supported commands: help, cls, ver, date, time, dir, cd, start, open, exit (Tab autocomplete supported)";
const DOS_COMMANDS = [
  "help",
  "cls",
  "ver",
  "date",
  "time",
  "dir",
  "cd",
  "start",
  "open",
  "exit",
] as const;
const START_TARGETS = [
  "computer",
  "document",
  "articles",
  "about",
  "guestbook",
  "contact",
  "notepad",
  "cmd",
  "run",
  "recyclebin",
  "readme",
  "github",
  "linkedin",
] as const;

const isFolderNode = (value: unknown): value is FolderNode =>
  !!value &&
  typeof value === "object" &&
  "kind" in value &&
  (value as FolderNode).kind === "folder";

const getFolderById = (id: string): FolderNode | null => {
  const node = initialFs.byId[id];
  if (!isFolderNode(node)) return null;
  return node;
};

const getPromptPath = (cwdId: CwdId): string => {
  if (!cwdId) return "C:\\";

  const labels: string[] = [];
  let cursor: string | null = cwdId;
  while (cursor) {
    const folder = getFolderById(cursor);
    if (!folder) break;
    labels.unshift(folder.name);
    cursor = typeof folder.parentId === "string" ? folder.parentId : null;
  }

  return labels.length > 0 ? `C:\\${labels.join("\\")}` : "C:\\";
};

const folderMatches = (folderId: string, name: string): boolean => {
  const folder = getFolderById(folderId);
  if (!folder) return false;
  const normalized = name.toLowerCase();
  return (
    folderId.toLowerCase() === normalized ||
    folder.name.toLowerCase() === normalized
  );
};

const getChildFolderIds = (cwdId: CwdId): string[] => {
  if (!cwdId) return initialFs.rootIds;
  const currentFolder = getFolderById(cwdId);
  if (!currentFolder) return [];
  return currentFolder.children.filter((childId) => {
    const child = initialFs.byId[childId];
    return isFolderNode(child);
  });
};

const listDirectoryLines = (cwdId: CwdId): string[] => {
  const folderIds = getChildFolderIds(cwdId);
  if (folderIds.length === 0) {
    return ["<EMPTY>"];
  }

  return folderIds.map((folderId) => {
    const folder = getFolderById(folderId);
    return `<DIR>    ${folder?.name ?? folderId}`;
  });
};

const resolveFolderId = (cwdId: CwdId, token: string): CwdId | null => {
  const normalized = token.trim().toLowerCase();
  if (!normalized) return cwdId;

  if (normalized === "..") {
    if (!cwdId) return null;
    const folder = getFolderById(cwdId);
    const parentId = folder?.parentId;
    return typeof parentId === "string" ? parentId : null;
  }

  const candidates = getChildFolderIds(cwdId);
  const matched = candidates.find((folderId) =>
    folderMatches(folderId, normalized),
  );
  return matched ?? null;
};

type TabCompletionResult = {
  matches: string[];
  completion: string | null;
};

const getLongestCommonPrefix = (values: string[]): string => {
  if (values.length === 0) return "";

  let prefix = values[0];
  for (let i = 1; i < values.length; i += 1) {
    while (
      prefix.length > 0 &&
      !values[i].toLowerCase().startsWith(prefix.toLowerCase())
    ) {
      prefix = prefix.slice(0, -1);
    }

    if (prefix.length === 0) {
      return "";
    }
  }

  return prefix;
};

const resolveTabCompletion = (
  inputValue: string,
  candidates: readonly string[],
): TabCompletionResult => {
  const normalized = inputValue.toLowerCase();
  const matches = candidates.filter((candidate) =>
    candidate.toLowerCase().startsWith(normalized),
  );

  if (matches.length === 0) {
    return { matches, completion: null };
  }

  if (matches.length === 1) {
    return { matches, completion: matches[0] };
  }

  const prefix = getLongestCommonPrefix(matches);
  return {
    matches,
    completion: prefix.length > inputValue.length ? prefix : null,
  };
};

export default function DosPromptWindow({ winId }: DosPromptWindowProps) {
  const { getById, close, open } = useApplicationStore((s) => s);
  const win = getById(winId);

  const [lines, setLines] = useState<string[]>([
    VERSION_TEXT,
    "Type HELP to see available commands.",
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cwdId, setCwdId] = useState<CwdId>(null);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const appendLines = useCallback((nextLines: string[]) => {
    setLines((prev) => [...prev, ...nextLines]);
    requestAnimationFrame(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    });
  }, []);

  const executeCommand = useCallback(
    (rawInput: string) => {
      const trimmed = rawInput.trim();
      const promptPath = getPromptPath(cwdId);
      appendLines([`${promptPath}>${rawInput}`]);

      if (!trimmed) return;

      const [rawCommand, ...rest] = trimmed.split(/\s+/);
      const command = rawCommand.toLowerCase();
      const argument = rest.join(" ").trim();

      if (command === "cls") {
        setLines([]);
        return;
      }

      if (command === "help") {
        appendLines([HELP_TEXT]);
        return;
      }

      if (command === "ver") {
        appendLines([VERSION_TEXT]);
        return;
      }

      if (command === "date") {
        appendLines([new Date().toLocaleDateString()]);
        return;
      }

      if (command === "time") {
        appendLines([new Date().toLocaleTimeString()]);
        return;
      }

      if (command === "dir") {
        const targetId = resolveFolderId(cwdId, argument);
        if (argument && targetId === null) {
          appendLines(["File Not Found"]);
          return;
        }

        appendLines([
          `Directory of ${getPromptPath(targetId)}`,
          ...listDirectoryLines(targetId),
        ]);
        return;
      }

      if (command === "cd") {
        if (!argument) {
          appendLines([getPromptPath(cwdId)]);
          return;
        }

        const targetId = resolveFolderId(cwdId, argument);
        if (targetId === null && argument !== "..") {
          appendLines(["The system cannot find the path specified."]);
          return;
        }

        setCwdId(targetId);
        return;
      }

      if (command === "start" || command === "open") {
        if (!argument) {
          appendLines([`Usage: ${command} <target>`]);
          return;
        }

        const result = launchTarget(argument, { open });
        if (!result.ok) {
          appendLines([result.message]);
          return;
        }

        const normalizedTarget = normalizeRunCommand(argument).split(" ")[0];
        appendLines([`Started ${normalizedTarget}.`]);
        return;
      }

      if (command === "exit") {
        close(winId);
        return;
      }

      appendLines([
        `'${rawCommand}' is not recognized as an internal or external command.`,
      ]);
    },
    [appendLines, close, cwdId, open, winId],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const nextInput = input;
      setInput("");
      setHistoryIndex(-1);

      if (nextInput.trim()) {
        setHistory((prev) => [...prev, nextInput]);
      }

      executeCommand(nextInput);
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    [executeCommand, input],
  );

  const handleInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Tab") {
        event.preventDefault();

        const hasTrailingSpace = /\s$/.test(input);
        const trimmedInput = input.trim();
        const tokens = trimmedInput ? trimmedInput.split(/\s+/) : [];

        if (tokens.length === 0) {
          const completion = resolveTabCompletion("", DOS_COMMANDS);
          if (completion.completion) {
            setInput(`${completion.completion} `);
          }
          return;
        }

        const commandToken = tokens[0];
        const commandLower = commandToken.toLowerCase();

        if (tokens.length === 1 && !hasTrailingSpace) {
          const completion = resolveTabCompletion(commandToken, DOS_COMMANDS);
          if (completion.completion) {
            const shouldAppendSpace = completion.matches.length === 1;
            setInput(
              `${completion.completion}${shouldAppendSpace ? " " : ""}`,
            );
            return;
          }

          if (completion.matches.length > 1) {
            appendLines([completion.matches.join("  ")]);
          }
          return;
        }

        if (
          commandLower !== "cd" &&
          commandLower !== "dir" &&
          commandLower !== "start" &&
          commandLower !== "open"
        ) {
          return;
        }

        const currentArg = hasTrailingSpace ? "" : (tokens[tokens.length - 1] ?? "");
        const candidates =
          commandLower === "cd" || commandLower === "dir"
            ? [
                "..",
                ...getChildFolderIds(cwdId).map((folderId) => {
                  const folder = getFolderById(folderId);
                  return folder?.name ?? folderId;
                }),
              ]
            : [...START_TARGETS];
        const dedupedCandidates = Array.from(new Set(candidates));
        const completion = resolveTabCompletion(currentArg, dedupedCandidates);

        if (completion.completion) {
          setInput(`${commandToken} ${completion.completion}`);
          return;
        }

        if (completion.matches.length > 1) {
          appendLines([completion.matches.join("  ")]);
        }
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (history.length === 0) return;
        const nextIndex =
          historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex] ?? "");
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (history.length === 0) return;
        if (historyIndex < 0) return;

        const nextIndex = historyIndex + 1;
        if (nextIndex >= history.length) {
          setHistoryIndex(-1);
          setInput("");
          return;
        }

        setHistoryIndex(nextIndex);
        setInput(history[nextIndex] ?? "");
      }
    },
    [appendLines, cwdId, history, historyIndex, input],
  );

  if (!win) return null;

  return (
    <Window
      winId={winId}
      initialWidth="680px"
      initialHeight="460px"
      initialX="10%"
      initialY="8%"
    >
      <WindowResizeHeader />
      <WindowBody
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#c0c0c0",
          padding: "4px",
          overflow: "hidden",
        }}
      >
        <div className="DosPromptWindow__terminal">
          <div
            className="DosPromptWindow__output"
            ref={outputRef}
            onClick={() => inputRef.current?.focus()}
          >
            {lines.map((line, index) => (
              <div key={`${line}-${index}`}>{line}</div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="DosPromptWindow__inputRow">
            <span className="DosPromptWindow__prompt">
              {getPromptPath(cwdId)}&gt;
            </span>
            <input
              className="DosPromptWindow__input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleInputKeyDown}
              autoFocus
              spellCheck={false}
            />
          </form>
        </div>
      </WindowBody>
    </Window>
  );
}
