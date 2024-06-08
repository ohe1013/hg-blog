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
    label: "blog",
    iconUrl: "/assets/img/notion.png",
  },
  about: {
    label: "about",
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

export type ApplicationActions = {
  getApplications: () => DefaultApplication[];
  openApplication: (key: DefaultApplication) => void;
  closeApplication: (key: DefaultApplication) => void;
};

export type ApplicationStore = ApplicationState & ApplicationActions;

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

export const createApplicationStore = (initState: ApplicationState = defaultInitState) => {
  return create<ApplicationStore>()((set) => ({
    ...initState,
    openApplication: (key: DefaultApplication) =>
      set((state) => ({
        [key]: {
          ...state[key],
          useApplication: true,
        },
      })),
    closeApplication: (key: DefaultApplication) =>
      set((state) => ({
        [key]: {
          ...state[key],
          useApplication: false,
        },
      })),
    getApplications: () => Object.keys(defaultApplicationState) as DefaultApplication[],
  }));
};
