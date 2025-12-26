import { FileData } from "../types";
import { iconDict } from "./icon";

export const about: FileData = {
  me: {
    id: "me",
    name: "me.md",
    kind: "file",
    parentId: "about",
    iconUrl: iconDict.notion,
    type: "notion",
    app: "article-viewer",
    pageId: "88d3fb4a1ab64838a9d755b69d7cb80e",
  },
  github: {
    id: "github",
    name: "github",
    kind: "file",
    parentId: "about",
    iconUrl: iconDict.github,
    type: "external-link",
    app: "external-link-confirm",
    payload: {
      url: "https://github.com/ohe1013",
    },
  },
  linkedIn: {
    id: "linkedIn",
    name: "linkedIn",
    kind: "file",
    parentId: "about",
    iconUrl: iconDict.linkedIn,
    type: "external-link",
    app: "external-link-confirm",
    payload: {
      url: "https://www.linkedin.com/in/%ED%98%84%EA%B7%BC-%EC%98%A4-737066254/",
    },
  },
};
