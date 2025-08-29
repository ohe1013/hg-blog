// stores/windows-store.ts
import { create } from "zustand";

export type AppType = "blog" | "computer" | "document" | "about";

export type WindowBounds = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type WindowState = {
  id: string;
  app: AppType;
  params?: Record<string, any>; // e.g. { pageId }
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  bounds: WindowBounds; // 커밋되는 좌표/사이즈
};

type WindowsStore = {
  windows: WindowState[];
  topZ: number;

  openWindow: (
    w: Omit<WindowState, "id" | "zIndex" | "minimized" | "maximized">
  ) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  setBounds: (id: string, patch: Partial<WindowBounds>) => void;
  setMinimized: (id: string, v: boolean) => void;
  toggleMaximized: (id: string) => void;
};

export const useWindowsStore = create<WindowsStore>((set, get) => ({
  windows: [],
  topZ: 1,

  openWindow: (w) => {
    const id = crypto.randomUUID();
    const z = get().topZ + 1;
    set((state) => ({
      windows: [
        ...state.windows,
        {
          id,
          app: w.app,
          params: w.params,
          bounds: w.bounds ?? { x: 80, y: 80, w: 640, h: 480 },
          zIndex: z,
          minimized: false,
          maximized: false,
        },
      ],
      topZ: z,
    }));
    return id;
  },

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    })),

  focusWindow: (id) =>
    set((state) => {
      const z = state.topZ + 1;
      return {
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, zIndex: z } : w
        ),
        topZ: z,
      };
    }),

  setBounds: (id, patch) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, bounds: { ...w.bounds, ...patch } } : w
      ),
    })),

  setMinimized: (id, v) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: v } : w
      ),
    })),

  toggleMaximized: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, maximized: !w.maximized } : w
      ),
    })),
}));
