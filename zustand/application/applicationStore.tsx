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
    initialData?: any,
  ) => string;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  restore: (id: string) => void;
  updateParams: (id: string, path: Record<string, any>) => void;
  rename: (id: string, title: string) => void;

  getById: (id: string) => WindowInstance | undefined;
  getApplicationKeys: () => AppsType[];
};
export type ApplicationStore = ApplicationState & ApplicationMethod;

const defaultInitState: ApplicationState = {
  apps: APP_CATALOG as Record<AppsType, AppCatalogItem>,
  windows: [],
  topZ: 1,
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
          w.id === id ? { ...w, params: { ...(w.params ?? {}), ...patch } } : w,
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
  }));
