// src/stores/counter-store.ts
import { create } from "zustand";

const defaultApplicationState = {
  computer: {
    label: "Computer",
    iconUrl: "https://win98icons.alexmeub.com/images/computer_explorer-2.png",
    miniIconUrl: "https://win98icons.alexmeub.com/icons/png/computer_explorer-0.png",
  },
  document: {
    label: "Documents",
    iconUrl: "https://win98icons.alexmeub.com/images/directory_closed-3.png",
    miniIconUrl: "https://win98icons.alexmeub.com/icons/png/directory_closed-1.png",
  },
  blog: {
    label: "Blog",
    iconUrl: "/assets/img/notion-logo-no-background.png",
    miniIconUrl: "/assets/img/notion-logo-no-background.png",
  },
  about: {
    label: "About",
    iconUrl: "/assets/img/notion-logo-no-background.png",
    miniIconUrl: "/assets/img/notion-logo-no-background.png",
  },
};

export type DefaultApplicationKey = keyof typeof defaultApplicationState;

type ApplicationValue = {
  label: string;
  iconUrl: string;
  useIconInDesktop: boolean;
  useApplication: boolean;
  zIndex: number;
  startBarIndex: number;
  miniIconUrl: string;
};

export type ApplicationState = {
  application: {
    [key in DefaultApplicationKey]: ApplicationValue;
  };
};

// export type ApplicationSelector = {
//   stackList: ApplicationValue[];
// };

export type ApplicationActions = {
  getApplications: () => DefaultApplicationKey[];
  touchUsedApplication: (key: DefaultApplicationKey) => void;
  openApplication: (key: DefaultApplicationKey) => void;
  closeApplication: (key: DefaultApplicationKey) => void;
};

export type ApplicationStore = ApplicationState & ApplicationActions;

const initDefault = (key: DefaultApplicationKey) => {
  return {
    label: defaultApplicationState[key].label,
    iconUrl: defaultApplicationState[key].iconUrl,
    useIconInDesktop: true,
    useApplication: false,
    zIndex: 0,
    startBarIndex: Infinity,
    miniIconUrl: defaultApplicationState[key].miniIconUrl,
  };
};

export const defaultInitState: ApplicationState = {
  application: {
    computer: initDefault("computer"),
    document: initDefault("document"),
    blog: initDefault("blog"),
    about: initDefault("about"),
  },
};

let zIndex = 0;
let startBarIndex = 0;

export const createApplicationStore = (initState: ApplicationState = defaultInitState) => {
  return create<ApplicationStore>()((set) => ({
    ...initState,

    touchUsedApplication: (key: DefaultApplicationKey) => {
      set((state) => ({
        application: {
          ...state.application,
          [key]: {
            ...state.application[key],
            zIndex: zIndex,
          },
        },
      }));
      zIndex++;
    },

    openApplication: (key: DefaultApplicationKey) => {
      set((state) => ({
        application: {
          ...state.application,
          [key]: {
            ...state.application[key],
            zIndex: zIndex,
            startBarIndex: startBarIndex,
            useApplication: true,
          },
        },
      }));
      zIndex++;
      startBarIndex++;
    },
    closeApplication: (key: DefaultApplicationKey) => {
      set((state) => ({
        application: {
          ...state.application,
          [key]: {
            ...state.application[key],
            zIndex: 0,
            startBarIndex: Infinity,
            useApplication: false,
          },
        },
      }));
    },
    getApplications: () => Object.keys(defaultApplicationState) as DefaultApplicationKey[],
  }));
};
