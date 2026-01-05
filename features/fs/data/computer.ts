import { FileData } from "../types";
import { iconDict } from "./icon";

export const computer: FileData = {
  // level 1 folders
  // root files
  computer_file_readme: {
    id: "computer_file_readme",
    name: "Readme.txt",
    kind: "file",
    parentId: "computer",
    iconUrl: iconDict.notepad,
    type: "file",
    app: "notepad",
    payload:
      "Welcome\nThis is a demo filesystem. it's saved in sessionStorage.",
  },
  computer_f_projects: {
    id: "computer_f_projects",
    name: "Projects",
    kind: "folder",
    parentId: "computer",
    children: ["file_spec", "f_photos", "img_app"],
    iconUrl: iconDict.folder,
    type: "folder",
  },
  computer_f_docs: {
    id: "computer_f_docs",
    name: "Docs",
    kind: "folder",
    parentId: "computer",
    children: [],
    iconUrl: iconDict.folder,
    type: "folder",
  },
  computer_file_spec: {
    id: "computer_file_spec",
    name: "spec.txt",
    kind: "file",
    parentId: "computer_f_projects",
    iconUrl: iconDict.notepad,
    type: "file",
    app: "notepad",
    payload: "Feature spec v1.0",
  },
  computer_img_app: {
    id: "computer_img_app",
    name: "app.png",
    kind: "file",
    parentId: "computer_f_projects",
    iconUrl: iconDict.notepad,
    type: "notepad",
    app: "image-viewer",
    payload: "/assets/demo/app.png",
  },

  // level 3 folder
  computer_f_2025: {
    id: "computer_f_2025",
    name: "2025",
    kind: "folder",
    parentId: "computer_f_photos",
    children: ["file_trip", "img_cat"],
    iconUrl: iconDict.folder,
    type: "folder",
  },

  // level 3 files
  computer_file_trip: {
    id: "computer_file_trip",
    name: "trip.md",
    kind: "file",
    parentId: "computer_f_2025",
    iconUrl: iconDict.notepad,
    type: "notepad",
    app: "file",
    payload: "### Spring Trip 2025\n- Seoul → Jeju",
  },
  computer_img_cat: {
    id: "computer_img_cat",
    name: "cat.png",
    kind: "file",
    parentId: "computer_f_2025",
    iconUrl: iconDict.notepad,
    type: "notepad",
    app: "file",
    payload: "/assets/demo/cat.png",
  },
};
