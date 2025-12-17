import { FileData } from "../types";
import { iconDict } from "./icon";

export const computer: FileData = {
  // level 1 folders
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
};
