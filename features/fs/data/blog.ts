import { FileData } from "../types";
import { iconDict } from "./icon";

export const blog: FileData = {
  react_study: {
    id: "react_study",
    name: "리액트_공식문서_분석",
    kind: "file",
    parentId: "blog",
    iconUrl: iconDict.notion,
    type: "notion",
    app: "blog-viewer",
    pageId: "study-react-732f1b8600004f14bae67e6d115df05c",
  },
  vanilla_to_vue: {
    id: "vanilla_to_vue",
    name: "바닐라js로 vue만들기",
    kind: "file",
    parentId: "blog",
    iconUrl: iconDict.notion,
    type: "notion",
    app: "blog-viewer",
    pageId: "Vannila-to-Vue-279145eb576b8035b39bd83c7dac0830",
  },
};
