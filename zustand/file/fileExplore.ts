import { create } from "zustand";

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  iconUrl: string;
  children?: FileNode[];
}

interface ExplorerState {
  root: FileNode[];
  currentPath: string[]; // ex: ['C:', 'Users']
  history: string[][];
}

interface ExplorerActions {
  enterFolder: (name: string) => void;
  goBack: () => void;
  goForward: () => void;
  resetToRoot: () => void;
}

export const useFileExplorerStore = create<ExplorerState & ExplorerActions>(
  (set, get) => ({
    root: [
      {
        id: "docs",
        name: "Documents",
        type: "folder",
        iconUrl: "/icons/folder.svg",
        children: [
          {
            id: "readme",
            name: "Readme.txt",
            type: "file",
            iconUrl: "/icons/text.svg",
          },
        ],
      },
      {
        id: "img",
        name: "Pictures",
        type: "folder",
        iconUrl: "/icons/folder.svg",
      },
    ],
    currentPath: [],
    history: [],
    enterFolder: (name) => {
      const { currentPath, history } = get();
      const nextPath = [...currentPath, name];
      set({
        currentPath: nextPath,
        history: [...history, currentPath],
      });
    },
    goBack: () => {
      const { history, currentPath } = get();
      if (history.length === 0) return;
      const prev = history[history.length - 1];
      set({
        currentPath: prev,
        history: history.slice(0, -1),
      });
    },
    goForward: () => {
      // optional: implement forward stack
    },
    resetToRoot: () => {
      set({ currentPath: [], history: [] });
    },
  })
);
