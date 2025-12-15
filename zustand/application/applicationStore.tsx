import { create } from "zustand";

export type AppsType = "blog" | "about" | "computer" | "document" | "notepad";

type AppCatalogItem = {
  key: AppsType;
  label: string;
  iconUrl: string;
  miniIconUrl: string;
  showOnDesktop?: boolean;
  singleton?: boolean; // 하나만 허용
};

export type WindowInstance = {
  id: string;
  app: AppsType;
  title: string;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  params?: Record<string, any>; // blog:{pageId}, about:{pageId} 등
  initialData?: any; // SSR hydration data
};

type ApplicationState = {
  apps: Record<AppsType, AppCatalogItem>;
  windows: WindowInstance[];
  topZ: number;

  // actions
};

type ApplicationMethod = {
  open: (
    app: AppsType,
    params?: Record<string, any>,
    initialData?: any
  ) => string;
  close: (id: string) => void;
  focus: (id: string) => void;
  updateParams: (id: string, path: Record<string, any>) => void;
  rename: (id: string, title: string) => void;

  getById: (id: string) => WindowInstance | undefined;
  getApplicationKeys: () => AppsType[];
};
export type ApplicationStore = ApplicationState & ApplicationMethod;

const defaultInitState: ApplicationState = {
  apps: {
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
    blog: {
      key: "blog",
      label: "Blog",
      iconUrl: "/assets/img/notion-logo-no-background.png",
      miniIconUrl: "/assets/img/notion-logo-no-background.png",
      showOnDesktop: true,
      singleton: false,
    },
    about: {
      key: "about",
      label: "About Me",
      iconUrl: "/assets/img/notion-logo-no-background.png",
      miniIconUrl: "/assets/img/notion-logo-no-background.png",
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
  },
  windows: [],
  topZ: 1,
};
function computeTitle(
  base: string,
  app: AppsType,
  params?: Record<string, any>
) {
  if ((app === "blog" || app === "about") && params?.pageId) {
    return `${base} - ${String(params.pageId).slice(0, 6)}`;
  }
  return base;
}
export const createApplicationStore = (
  initState: ApplicationState = defaultInitState
) =>
  create<ApplicationStore>()((set, get) => ({
    ...initState,

    open: (app, params, initialData) => {
      const { apps, windows, topZ } = get();

      if (apps[app]?.singleton) {
        const ex = windows.find((w) => w.app === app);
        if (ex) {
          // 새 파라미터가 오면 기존 창에 병합 적용
          if (params && Object.keys(params).length) {
            get().updateParams(ex.id, params); // ← 아래 추가할 액션
            // (선택) 타이틀도 재계산
            const nextTitle = computeTitle(apps[app]?.label ?? app, app, {
              ...(ex.params ?? {}),
              ...params,
            });
            get().rename(ex.id, nextTitle);
          }
          get().focus(ex.id);
          return ex.id;
        }
      }

      const id = Math.random().toString(36).substring(7);
      const baseTitle = apps[app]?.label ?? app;
      const title = computeTitle(baseTitle, app, params);

      const win: WindowInstance = {
        id,
        app,
        title,
        minimized: false,
        maximized: false,
        zIndex: topZ + 1,
        params,
        initialData,
      };

      set({ windows: [...windows, win], topZ: topZ + 1 });
      return id;
    },
    updateParams: (id, patch) =>
      set((s) => ({
        windows: s.windows.map((w) =>
          w.id === id ? { ...w, params: { ...(w.params ?? {}), ...patch } } : w
        ),
      })),
    rename: (id, title) =>
      set((s) => ({
        windows: s.windows.map((w) => (w.id === id ? { ...w, title } : w)),
      })),

    close: (id) =>
      set((s) => ({ windows: s.windows.filter((w) => w.id !== id) })),
    focus: (id) =>
      set((s) => {
        const newTop = s.topZ + 1;
        return {
          windows: s.windows.map((w) =>
            w.id === id ? { ...w, zIndex: newTop } : w
          ),
          topZ: newTop,
        };
      }),
    getById: (id) => get().windows.find((w) => w.id === id),

    getApplicationKeys: () => Object.keys(get().apps) as AppsType[],
  }));
