import { FileData } from "../types";
import { iconDict } from "./icon";

export const document: FileData = {
  // level 1 folders
  // root files
  document_file_readme: {
    id: "document_file_readme",
    name: "Readme.txt",
    kind: "file",
    parentId: "document",
    iconUrl: iconDict.notepad,
    type: "file",
    app: "notepad",
    payload:
      "Welcome\nThis is a demo filesystem. it's saved in sessionStorage.",
  },
  document_f_projects: {
    id: "document_f_projects",
    name: "Projects",
    kind: "folder",
    parentId: "document",
    children: ["file_spec", "f_photos", "img_app"],
    iconUrl: iconDict.folder,
    type: "folder",
  },
  document_f_docs: {
    id: "document_f_docs",
    name: "Docs",
    kind: "folder",
    parentId: "document",
    children: [],
    iconUrl: iconDict.folder,
    type: "folder",
  },
  document_file_spec: {
    id: "document_file_spec",
    name: "spec.txt",
    kind: "file",
    parentId: "document_f_projects",
    iconUrl: iconDict.notepad,
    type: "notepad",
    app: "text-viewer",
    payload: "Feature spec v1.0",
  },
  document_img_app: {
    id: "document_img_app",
    name: "app.png",
    kind: "file",
    parentId: "document_f_projects",
    iconUrl: iconDict.notepad,
    type: "notepad",
    app: "image-viewer",
    payload: "/assets/demo/app.png",
  },

  // level 3 folder
  document_f_2025: {
    id: "document_f_2025",
    name: "2025",
    kind: "folder",
    parentId: "document_f_photos",
    children: ["file_trip", "img_cat"],
    iconUrl: iconDict.folder,
    type: "folder",
  },

  // level 3 files
  document_file_trip: {
    id: "document_file_trip",
    name: "trip.md",
    kind: "file",
    parentId: "document_f_2025",
    iconUrl: iconDict.notepad,
    type: "file",
    app: "notepad",
    payload: "### Spring Trip 2025\n- Seoul → Jeju",
  },
  document_img_cat: {
    id: "document_img_cat",
    name: "cat.png",
    kind: "file",
    parentId: "document_f_2025",
    iconUrl: iconDict.notepad,
    type: "file",
    app: "image-viewer",
    payload: "/assets/demo/cat.png",
  },
};
