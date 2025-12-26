import { FileSystem } from "../types";
import { iconDict } from "./icon";
import { articles } from "./articles";
import { computer } from "./computer";
import { document } from "./document";
import { about } from "./about";

export const initialFs: FileSystem = {
  rootIds: ["computer", "document", "articles", "about"], // ✅ 여러 root
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

    articles: {
      id: "articles",
      name: "Articles",
      kind: "folder",
      parentId: null, // ✅ 최상단
      children: Object.entries(articles)
        .filter(([_, value]) => value.parentId === "articles")
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
    ...articles,
    ...about,
    ...document,
    readme: {
      id: "readme",
      name: "readme.txt",
      kind: "file",
      parentId: null,
      type: "file",
      app: "notepad",
      iconUrl: iconDict.notepad,
      payload: `HG-BLOG v1.0.0
====================

Welcome to my personal blog. This is a nostalgic Windows 98-style interface built with Next.js and Tailwind CSS.

Features:
- Windows System: Draggable, resizable, and stackable windows.
- Desktop: Grid-based icons with drag-select and navigation support.
- Explorer: Folder-based navigation for articles and computer data.
- Notion Integration: Articles are fetched directly from Notion.
- Notepad: Simple text editor with local storage support.

Feel free to look around and explore the articles!
`,
    },
  },
};
