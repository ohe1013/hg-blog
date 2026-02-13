import { iconDict } from "@features/fs/data/icon";

export const EXPLORER_ROOT_IDS = [
  "computer",
  "document",
  "articles",
  "about",
] as const;

export const EXPLORER_ROOT = {
  computer: "computer",
  document: "document",
  articles: "articles",
  about: "about",
} as const;

export type ExplorerRootId = (typeof EXPLORER_ROOT_IDS)[number];

export const EXPLORER_ROOT_META: Record<
  ExplorerRootId,
  { name: string; iconUrl: string }
> = {
  computer: {
    name: "Computer",
    iconUrl: iconDict.folder,
  },
  document: {
    name: "Document",
    iconUrl: iconDict.folder,
  },
  articles: {
    name: "Articles",
    iconUrl: iconDict.folder,
  },
  about: {
    name: "About",
    iconUrl: iconDict.folder,
  },
};

export const EXTERNAL_LINKS = {
  github: "https://github.com/ohe1013",
  linkedIn:
    "https://www.linkedin.com/in/%ED%98%84%EA%B7%BC-%EC%98%A4-737066254/",
} as const;

export const APP_KEYS = [
  "computer",
  "document",
  "articles",
  "about",
  "notepad",
  "article-viewer",
  "external-link-confirm",
  "github",
  "linkedIn",
  "readme",
] as const;

export type SystemAppKey = (typeof APP_KEYS)[number];

export type AppCatalogEntry = {
  key: SystemAppKey;
  label: string;
  iconUrl: string;
  miniIconUrl: string;
  showOnDesktop?: boolean;
  singleton?: boolean;
  externalUrl?: string;
};

export const APP_CATALOG: Record<SystemAppKey, AppCatalogEntry> = {
  computer: {
    key: "computer",
    label: "Computer",
    iconUrl: "https://win98icons.alexmeub.com/images/computer_explorer-2.png",
    miniIconUrl:
      "https://win98icons.alexmeub.com/icons/png/computer_explorer-0.png",
    showOnDesktop: true,
    singleton: true,
  },
  document: {
    key: "document",
    label: "Documents",
    iconUrl: "https://win98icons.alexmeub.com/images/directory_closed-3.png",
    miniIconUrl:
      "https://win98icons.alexmeub.com/icons/png/directory_closed-1.png",
    showOnDesktop: true,
    singleton: true,
  },
  articles: {
    key: "articles",
    label: "Articles",
    iconUrl: iconDict.notion,
    miniIconUrl: iconDict.notion,
    showOnDesktop: true,
    singleton: false,
  },
  about: {
    key: "about",
    label: "About Me",
    iconUrl: iconDict.notion,
    miniIconUrl: iconDict.notion,
    showOnDesktop: true,
    singleton: false,
  },
  notepad: {
    key: "notepad",
    label: "Notepad",
    iconUrl: "https://win98icons.alexmeub.com/icons/png/notepad-1.png",
    miniIconUrl: "https://win98icons.alexmeub.com/icons/png/notepad-0.png",
    showOnDesktop: false,
    singleton: false,
  },
  "article-viewer": {
    key: "article-viewer",
    label: "Article Post",
    iconUrl: iconDict.notion,
    miniIconUrl: iconDict.notion,
    showOnDesktop: false,
    singleton: false,
  },
  github: {
    key: "github",
    label: "GitHub",
    iconUrl: iconDict.github,
    miniIconUrl: iconDict.github,
    showOnDesktop: true,
    singleton: true,
    externalUrl: EXTERNAL_LINKS.github,
  },
  linkedIn: {
    key: "linkedIn",
    label: "LinkedIn",
    iconUrl: iconDict.linkedIn,
    miniIconUrl: iconDict.linkedIn,
    showOnDesktop: true,
    singleton: true,
    externalUrl: EXTERNAL_LINKS.linkedIn,
  },
  "external-link-confirm": {
    key: "external-link-confirm",
    label: "Link Confirmation",
    iconUrl: "https://win98icons.alexmeub.com/icons/png/msg_warning-0.png",
    miniIconUrl: "",
    showOnDesktop: false,
    singleton: false,
  },
  readme: {
    key: "readme",
    label: "readme.txt",
    iconUrl: iconDict.notepad,
    miniIconUrl: iconDict.notepad,
    showOnDesktop: true,
    singleton: false,
  },
};

export const TITLED_PAGE_APPS = new Set<SystemAppKey>([
  "articles",
  "about",
  "article-viewer",
]);
