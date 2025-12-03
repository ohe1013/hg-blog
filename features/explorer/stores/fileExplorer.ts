// stores/fileExplorer.ts (예시)
import { create } from "zustand";
import { FileId, FileSystem } from "../fs/types";

type ExplorerState = {
  fs: FileSystem;
  currentId: FileId;
  selectedIds: FileId[];
  backStack: FileId[];
  forwardStack: FileId[];
  open: (id: FileId) => void;
  enter: (id: FileId) => void;
  back: () => void;
  forward: () => void;
  up: () => void;
};

const iconDict = {
  folder: "https://win98icons.alexmeub.com/images/directory_closed-3.png",
  notepad: "https://win98icons.alexmeub.com/icons/png/notepad-2.png",
  img: "https://win98icons.alexmeub.com/icons/png/notepad-2.png",
};
// fs/sampleFs.ts
const sampleFs: FileSystem = {
  rootId: "root",
  byId: {
    // level 0
    root: {
      id: "root",
      name: "This PC",
      kind: "folder",
      parentId: null,
      children: ["file_readme", "f_projects", "f_docs"],
      iconUrl: iconDict.folder,
      type: "folder",
    },

    // root files
    file_readme: {
      id: "file_readme",
      name: "Readme.md",
      kind: "file",
      parentId: "root",
      iconUrl: iconDict.notepad,
      type: "notepad",
      app: "markdown-viewer",
      payload: "Welcome\nThis is a demo filesystem.",
    },

    // level 1 folders
    f_projects: {
      id: "f_projects",
      name: "Projects",
      kind: "folder",
      parentId: "root",
      children: ["file_spec", "img_app", "f_photos"],
      iconUrl: iconDict.folder,
      type: "folder",
    },
    f_docs: {
      id: "f_docs",
      name: "Docs",
      kind: "folder",
      parentId: "root",
      children: ["doc_design"],
      iconUrl: iconDict.folder,
      type: "folder",
    },

    // level 1 files
    file_spec: {
      id: "file_spec",
      name: "spec.txt",
      kind: "file",
      parentId: "f_projects",
      iconUrl: iconDict.notepad,
      type: "notepad",
      app: "text-viewer",
      payload: "Feature spec v1.0",
    },
    img_app: {
      id: "img_app",
      name: "app.png",
      kind: "file",
      parentId: "f_projects",
      iconUrl: iconDict.notepad,
      type: "notepad",
      app: "image-viewer",
      payload: "/assets/demo/app.png",
    },
    doc_design: {
      id: "doc_design",
      name: "design.md",
      kind: "file",
      parentId: "f_docs",
      iconUrl: iconDict.notepad,
      type: "notepad",
      app: "markdown-viewer",
      payload: "## Design\n- Grid\n- Address bar\n- Viewers",
    },

    // level 2 folder
    f_photos: {
      id: "f_photos",
      name: "Photos",
      kind: "folder",
      parentId: "f_projects",
      children: ["img_cover", "f_2025"],
      iconUrl: iconDict.folder,
      type: "folder",
    },

    // level 2 file
    img_cover: {
      id: "img_cover",
      name: "cover.jpg",
      kind: "file",
      parentId: "f_photos",
      iconUrl: iconDict.notepad,
      type: "notepad",
      app: "image-viewer",
      payload: "/assets/demo/cover.jpg",
    },

    // level 3 folder
    f_2025: {
      id: "f_2025",
      name: "2025",
      kind: "folder",
      parentId: "f_photos",
      children: ["file_trip", "img_cat"],
      iconUrl: iconDict.folder,
      type: "folder",
    },

    // level 3 files
    file_trip: {
      id: "file_trip",
      name: "trip.md",
      kind: "file",
      parentId: "f_2025",
      iconUrl: iconDict.notepad,
      type: "notepad",
      app: "markdown-viewer",
      payload: "### Spring Trip 2025\n- Seoul → Jeju",
    },
    img_cat: {
      id: "img_cat",
      name: "cat.png",
      kind: "file",
      parentId: "f_2025",
      iconUrl: iconDict.notepad,
      type: "notepad",
      app: "image-viewer",
      payload: "/assets/demo/cat.png",
    },
  },
};

export const useExplorer = create<ExplorerState>((set, get) => ({
  fs: sampleFs,
  currentId: "root",
  selectedIds: [],
  backStack: [],
  forwardStack: [],

  open: (id) => {
    const { fs, currentId, backStack } = get();
    const node = fs.byId[id];
    if (!node) return;

    if (node.kind === "folder") {
      // 폴더 이동 시 히스토리 추가
      if (currentId !== id) {
        set({
          currentId: id,
          selectedIds: [],
          backStack: [...backStack, currentId],
          forwardStack: [], // 새 경로 진입 시 forward 초기화
        });
      }
    } else {
      // 파일 선택 등 (현재는 currentId 변경 없음)
      set({ currentId: id });
    }
  },

  enter: (id) => get().open(id),

  back: () => {
    const { backStack, currentId, forwardStack } = get();
    if (backStack.length === 0) return;

    const prev = backStack[backStack.length - 1];
    const newBack = backStack.slice(0, -1);

    set({
      currentId: prev,
      backStack: newBack,
      forwardStack: [currentId, ...forwardStack],
      selectedIds: [],
    });
  },

  forward: () => {
    const { forwardStack, currentId, backStack } = get();
    if (forwardStack.length === 0) return;

    const next = forwardStack[0];
    const newForward = forwardStack.slice(1);

    set({
      currentId: next,
      backStack: [...backStack, currentId],
      forwardStack: newForward,
      selectedIds: [],
    });
  },

  up: () => {
    const { fs, currentId, open } = get();
    const node = fs.byId[currentId];
    if (!node || !node.parentId) return;
    open(node.parentId);
  },
}));
