import { FileSystem } from "../types";

const iconDict = {
  folder: "https://win98icons.alexmeub.com/images/directory_closed-3.png",
  notepad: "https://win98icons.alexmeub.com/icons/png/notepad-2.png",
  img: "https://win98icons.alexmeub.com/icons/png/notepad-2.png",
};

export const initialFs: FileSystem = {
  rootIds: ["computer", "document", "blog"], // ✅ 여러 root
  byId: {
    // root 1
    computer: {
      id: "computer",
      name: "Computer",
      kind: "folder",
      parentId: null, // ✅ 최상단
      children: ["file_readme", "f_projects", "f_docs"],
      iconUrl: iconDict.folder,
      type: "folder",
    },

    // root 2
    blog: {
      id: "blog",
      name: "Blog",
      kind: "folder",
      parentId: null, // ✅ 최상단
      children: ["doc_design"],
      iconUrl: iconDict.folder,
      type: "folder",
    },
    document: {
      id: "document",
      name: "Document",
      kind: "folder",
      parentId: null, // ✅ 최상단
      children: ["doc_design"],
      iconUrl: iconDict.folder,
      type: "folder",
    },

    // root files
    file_readme: {
      id: "file_readme",
      name: "Readme.txt",
      kind: "file",
      parentId: "computer",
      iconUrl: iconDict.notepad,
      type: "notepad",
      app: "markdown-viewer",
      payload:
        "Welcome\nThis is a demo filesystem. it's saved in sessionStorage.",
    },

    // level 1 folders
    f_projects: {
      id: "f_projects",
      name: "Projects",
      kind: "folder",
      parentId: "computer",
      children: ["file_spec", "f_photos", "img_app"],
      iconUrl: iconDict.folder,
      type: "folder",
    },
    f_docs: {
      id: "f_docs",
      name: "Docs",
      kind: "folder",
      parentId: "computer",
      children: [],
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
      parentId: "root_docs", // ✅ 두 번째 root 밑으로 이동
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
