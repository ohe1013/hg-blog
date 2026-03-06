import { create } from "zustand";
import {
  APP_CATALOG,
  APP_KEYS,
  SystemAppKey,
  TITLED_PAGE_APPS,
} from "@features/explorer/data";

export type SystemApps = SystemAppKey;

export type AppsType = SystemApps | (string & {});

type AppCatalogItem = {
  key: SystemAppKey;
  label: string;
  iconUrl: string;
  miniIconUrl: string;
  showOnDesktop?: boolean;
  singleton?: boolean; // 하나만 허용
  externalUrl?: string;
};

export type WindowInstance = {
  id: string;
  app: AppsType;
  title: string;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  params?: Record<string, any>; // articles:{pageId}, about:{pageId} 등
  initialData?: any; // SSR hydration data
};

export type RecycleBinItem = {
  app: AppsType;
  deletedAt: number;
};

type ApplicationState = {
  apps: Record<AppsType, AppCatalogItem>;
  windows: WindowInstance[];
  topZ: number;
  hiddenDesktopApps: AppsType[];
  recycleBinItems: RecycleBinItem[];

  // actions
};

type ApplicationMethod = {
  open: (
    app: AppsType,
    params?: Record<string, any>,
    initialData?: any,
  ) => string;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  restore: (id: string) => void;
  updateParams: (id: string, path: Record<string, any>) => void;
  rename: (id: string, title: string) => void;
  moveToRecycleBin: (app: AppsType) => void;
  restoreFromRecycleBin: (app: AppsType) => void;
  emptyRecycleBin: () => void;

  getById: (id: string) => WindowInstance | undefined;
  getApplicationKeys: () => AppsType[];
  getDesktopKeys: () => AppsType[];
};
export type ApplicationStore = ApplicationState & ApplicationMethod;

const defaultInitState: ApplicationState = {
  apps: APP_CATALOG as Record<AppsType, AppCatalogItem>,
  windows: [],
  topZ: 1,
  hiddenDesktopApps: [],
  recycleBinItems: [],
};
function computeTitle(
  base: string,
  app: AppsType,
  params?: Record<string, any>,
) {
  if (TITLED_PAGE_APPS.has(app as SystemAppKey) && params?.pageId) {
    return `${base} - ${String(params.pageId).slice(0, 6)}`;
  }
  return base;
}
export const createApplicationStore = (
  initState: ApplicationState = defaultInitState,
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
          if (ex.minimized) {
            get().restore(ex.id);
          } else {
            get().focus(ex.id);
          }
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
          w.id === id ? { ...w, params: { ...(w.params ?? {}), ...patch } } : w,
        ),
      })),
    rename: (id, title) =>
      set((s) => ({
        windows: s.windows.map((w) => (w.id === id ? { ...w, title } : w)),
      })),
    moveToRecycleBin: (app) =>
      set((s) => {
        if (app === "recycle-bin") return {};
        if (s.hiddenDesktopApps.includes(app)) return {};

        const existingIndex = s.recycleBinItems.findIndex((i) => i.app === app);
        const nextItems =
          existingIndex >= 0
            ? s.recycleBinItems.filter((i) => i.app !== app)
            : s.recycleBinItems;

        return {
          hiddenDesktopApps: [...s.hiddenDesktopApps, app],
          recycleBinItems: [{ app, deletedAt: Date.now() }, ...nextItems],
        };
      }),
    restoreFromRecycleBin: (app) =>
      set((s) => ({
        hiddenDesktopApps: s.hiddenDesktopApps.filter((value) => value !== app),
        recycleBinItems: s.recycleBinItems.filter((item) => item.app !== app),
      })),
    emptyRecycleBin: () =>
      set((s) => ({
        recycleBinItems: [],
      })),

    close: (id) =>
      set((s) => ({ windows: s.windows.filter((w) => w.id !== id) })),
    focus: (id) =>
      set((s) => {
        const newTop = s.topZ + 1;
        return {
          windows: s.windows.map((w) =>
            w.id === id ? { ...w, zIndex: newTop } : w,
          ),
          topZ: newTop,
        };
      }),
    minimize: (id) =>
      set((s) => ({
        windows: s.windows.map((w) =>
          w.id === id ? { ...w, minimized: true } : w,
        ),
      })),
    restore: (id) =>
      set((s) => {
        const newTop = s.topZ + 1;
        return {
          windows: s.windows.map((w) =>
            w.id === id ? { ...w, minimized: false, zIndex: newTop } : w,
          ),
          topZ: newTop,
        };
      }),
    getById: (id) => get().windows.find((w) => w.id === id),

    getApplicationKeys: () => [...APP_KEYS],
    getDesktopKeys: () => {
      const { apps, hiddenDesktopApps } = get();
      return [...APP_KEYS].filter(
        (key) => apps[key]?.showOnDesktop && !hiddenDesktopApps.includes(key),
      ) as AppsType[];
    },
  }));
