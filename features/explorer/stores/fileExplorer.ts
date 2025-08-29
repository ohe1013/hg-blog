// stores/fileExplorer.ts (예시)
import { create } from "zustand";
import { FileId, FileSystem } from "../fs/types";

type ExplorerState = {
  fs: FileSystem;
  currentId: FileId;
  selectedIds: FileId[];
  open: (id: FileId) => void;
  enter: (id: FileId) => void;
  back: () => void;
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
    },

    // root files
    file_readme: {
      id: "file_readme",
      name: "Readme.md",
      kind: "file",
      parentId: "root",
      mime: "text/markdown",
      app: "markdown-viewer",
      payload: "# Welcome\nThis is a demo filesystem.",
    },

    // level 1 folders
    f_projects: {
      id: "f_projects",
      name: "Projects",
      kind: "folder",
      parentId: "root",
      children: ["file_spec", "img_app", "f_photos"],
    },
    f_docs: {
      id: "f_docs",
      name: "Docs",
      kind: "folder",
      parentId: "root",
      children: ["doc_design"],
    },

    // level 1 files
    file_spec: {
      id: "file_spec",
      name: "spec.txt",
      kind: "file",
      parentId: "f_projects",
      mime: "text/plain",
      app: "text-viewer",
      payload: "Feature spec v1.0",
    },
    img_app: {
      id: "img_app",
      name: "app.png",
      kind: "file",
      parentId: "f_projects",
      mime: "image/png",
      app: "image-viewer",
      payload: "/assets/demo/app.png",
    },
    doc_design: {
      id: "doc_design",
      name: "design.md",
      kind: "file",
      parentId: "f_docs",
      mime: "text/markdown",
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
    },

    // level 2 file
    img_cover: {
      id: "img_cover",
      name: "cover.jpg",
      kind: "file",
      parentId: "f_photos",
      mime: "image/jpeg",
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
    },

    // level 3 files
    file_trip: {
      id: "file_trip",
      name: "trip.md",
      kind: "file",
      parentId: "f_2025",
      mime: "text/markdown",
      app: "markdown-viewer",
      payload: "### Spring Trip 2025\n- Seoul → Jeju",
    },
    img_cat: {
      id: "img_cat",
      name: "cat.png",
      kind: "file",
      parentId: "f_2025",
      mime: "image/png",
      app: "image-viewer",
      payload: "/assets/demo/cat.png",
    },
  },
};

export const useExplorer = create<ExplorerState>((set, get) => ({
  fs: sampleFs,
  currentId: "root",
  selectedIds: [],
  open: (id) => {
    const node = get().fs.byId[id];
    if (!node) return;
    if (node.kind === "folder") set({ currentId: id, selectedIds: [] });
    else set({ currentId: id });
  },
  enter: (id) => get().open(id),
  back: () => {
    /* TODO: history 구현 */
  },
}));
