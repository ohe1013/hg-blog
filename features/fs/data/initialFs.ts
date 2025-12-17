import { FileSystem } from "../types";
import { iconDict } from "./icon";
import { blog } from "./blog";
import { computer } from "./computer";
import { document } from "./document";
import { about } from "./about";

export const initialFs: FileSystem = {
  rootIds: ["computer", "document", "blog"], // ✅ 여러 root
  byId: {
    // root 1
    computer: {
      id: "computer",
      name: "Computer",
      kind: "folder",
      parentId: null, // ✅ 최상단
      children: Object.entries(computer)
        .filter(([_, value]) => value.parentId === "computer")
        .map(([key]) => key),
      iconUrl: iconDict.folder,
      type: "folder",
    },

    blog: {
      id: "blog",
      name: "Blog",
      kind: "folder",
      parentId: null, // ✅ 최상단
      children: Object.entries(blog)
        .filter(([_, value]) => value.parentId === "blog")
        .map(([key]) => key),
      iconUrl: iconDict.folder,
      type: "folder",
    },
    document: {
      id: "document",
      name: "Document",
      kind: "folder",
      parentId: null, // ✅ 최상단
      children: Object.entries(document)
        .filter(([_, value]) => value.parentId === "document")
        .map(([key]) => key),
      iconUrl: iconDict.folder,
      type: "folder",
    },
    about: {
      id: "about",
      name: "About",
      kind: "folder",
      parentId: null, // ✅ 최상단
      children: Object.entries(about)
        .filter(([_, value]) => value.parentId === "about")
        .map(([key]) => key),
      iconUrl: iconDict.folder,
      type: "folder",
    },
    ...computer,
    ...blog,
    ...about,
    ...document,
  },
};
