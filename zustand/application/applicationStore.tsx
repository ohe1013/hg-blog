// src/stores/counter-store.ts
import { create } from "zustand";

const defaultApplicationState = {
  computer: {
    label: "Computer",
    iconUrl: "https://win98icons.alexmeub.com/images/computer_explorer-2.png",
  },
  document: {
    label: "Documents",
    iconUrl: "https://win98icons.alexmeub.com/images/directory_closed-3.png",
  },
  blog: {
    label: "Blog",
    iconUrl: "/assets/img/notion.png",
  },
  about: {
    label: "About",
    iconUrl: "/assets/img/notion.png",
  },
};

export type DefaultApplication = keyof typeof defaultApplicationState;

export type ApplicationState = {
  [key in DefaultApplication]: {
    label: string;
    iconUrl: string;
    useIconInDesktop: boolean;
    useApplication: boolean;
    zIndex: number;
  };
};

export type ApplicationSelector = {
  stackList: DefaultApplication[];
};

export type ApplicationActions = {
  getApplications: () => DefaultApplication[];
  openApplication: (key: DefaultApplication) => void;
  closeApplication: (key: DefaultApplication) => void;
};

export type ApplicationStore = ApplicationState &
  ApplicationSelector &
  ApplicationActions;

export const defaultInitState: ApplicationState = {
  computer: {
    label: defaultApplicationState["computer"].label,
    iconUrl: defaultApplicationState["computer"].iconUrl,
    useIconInDesktop: true,
    useApplication: false,
    zIndex: 0,
  },
  document: {
    label: defaultApplicationState["document"].label,
    iconUrl: defaultApplicationState["document"].iconUrl,
    useIconInDesktop: true,
    useApplication: false,
    zIndex: 0,
  },
  blog: {
    label: defaultApplicationState["blog"].label,
    iconUrl: defaultApplicationState["blog"].iconUrl,
    useIconInDesktop: true,
    useApplication: false,
    zIndex: 0,
  },
  about: {
    label: defaultApplicationState["about"].label,
    iconUrl: defaultApplicationState["about"].iconUrl,
    useIconInDesktop: true,
    useApplication: false,
    zIndex: 0,
  },
};

export const createApplicationStore = (
  initState: ApplicationState = defaultInitState
) => {
  return create<ApplicationStore>()((set) => ({
    ...initState,
    stackList: [],
    openApplication: (key: DefaultApplication) => {
      set((state) => ({
        [key]: {
          ...state[key],
          useApplication: true,
        },
      }));
      set((state) => ({ ...state, stackList: [...state.stackList, key] }));
    },
    closeApplication: (key: DefaultApplication) => {
      set((state) => ({
        [key]: {
          ...state[key],
          useApplication: false,
        },
      }));
      set((state) => ({
        ...state,
        stackList: [...state.stackList].filter((stack) => stack !== key),
      }));
    },
    getApplications: () =>
      Object.keys(defaultApplicationState) as DefaultApplication[],
  }));
};
