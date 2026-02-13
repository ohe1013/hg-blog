import { FileData } from "../types";
import { iconDict } from "./icon";
import { EXTERNAL_LINKS } from "@features/explorer/data";

export const about: FileData = {
  about_me: {
    id: "about_me",
    name: "about_me.md",
    kind: "file",
    parentId: "about",
    iconUrl: iconDict.notion,
    type: "notion",
    app: "article-viewer",
    pageId: "88d3fb4a1ab64838a9d755b69d7cb80e",
  },
  about_github: {
    id: "about_github",
    name: "github",
    kind: "file",
    parentId: "about",
    iconUrl: iconDict.github,
    type: "external-link",
    app: "external-link-confirm",
    payload: {
      url: EXTERNAL_LINKS.github,
    },
  },
  about_linkedin: {
    id: "about_linkedin",
    name: "linkedIn",
    kind: "file",
    parentId: "about",
    iconUrl: iconDict.linkedIn,
    type: "external-link",
    app: "external-link-confirm",
    payload: {
      url: EXTERNAL_LINKS.linkedIn,
    },
  },
};
