import { create } from "zustand";
import { shallow } from "zustand/shallow";

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  iconUrl: string;
  children?: FileNode[];
}

type Path = string[]; // folder id들의 배열 (root는 [])

interface LocationState {
  root: FileNode[]; // 트리(중첩 유지)
  currentPath: Path; // 현재 경로(폴더 id 리스트)
  backStack: Path[]; // 뒤로가기 스택
  forwardStack: Path[]; // 앞으로가기 스택
}

interface SelectionState {
  selectedIds: Record<string, true>; // Set 대용 (직렬화 쉬움)
  viewModeByPath: Record<string, "grid" | "list">; // 경로별 뷰모드
}

interface Actions {
  navigateTo: (path: Path, opts?: { replace?: boolean }) => void;
  enterFolderById: (id: string) => void;
  upOneLevel: () => void;
  goBack: () => void;
  goForward: () => void;
  resetToRoot: () => void;

  // selection
  toggleSelect: (id: string) => void;
  clearSelection: () => void;

  // view mode
  setViewMode: (mode: "grid" | "list") => void;
}

// ===== 유틸: 경로 → 폴더 노드/자식 찾기 =====
const findById = (nodes: FileNode[], id: string): FileNode | undefined => {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const hit = findById(n.children, id);
      if (hit) return hit;
    }
  }
};

const findFolderByPath = (root: FileNode[], path: Path): FileNode | null => {
  if (path.length === 0)
    return {
      id: "ROOT",
      name: "Computer",
      type: "folder",
      iconUrl: "",
      children: root,
    };
  let cur: FileNode | undefined = {
    id: "ROOT",
    name: "Computer",
    type: "folder",
    iconUrl: "",
    children: root,
  };
  for (const id of path) {
    if (!cur?.children) return null;
    cur = cur.children.find((c) => c.id === id);
    if (!cur || cur.type !== "folder") return null;
  }
  return cur ?? null;
};

const pathKey = (path: Path) => path.join("/"); // 뷰모드/캐시 키

// ===== 스토어 =====
export const useExplorer = create<LocationState & SelectionState & Actions>(
  (set, get) => ({
    // --- 초기 트리 ---
    root: [
      {
        id: "docs",
        name: "Documents",
        type: "folder",
        iconUrl: "/icons/folder.svg",
        children: [
          {
            id: "readme",
            name: "Readme.txt",
            type: "file",
            iconUrl: "/icons/text.svg",
          },
        ],
      },
      {
        id: "img",
        name: "Pictures",
        type: "folder",
        iconUrl: "/icons/folder.svg",
      },
    ],
    currentPath: [],
    backStack: [],
    forwardStack: [],

    // selection/view
    selectedIds: {},
    viewModeByPath: {},

    // --- 네비게이션 ---
    navigateTo: (nextPath, opts) => {
      const { currentPath, backStack } = get();
      const replace = opts?.replace;

      set((s) => ({
        currentPath: nextPath,
        backStack: replace ? backStack : [...backStack, currentPath],
        forwardStack: [], // 새 분기 시작 시 forward 비움 (브라우저와 동일)
        selectedIds: {}, // 폴더 변경 시 선택 초기화(선택적)
      }));
    },

    enterFolderById: (id) => {
      const { root, currentPath } = get();

      // 현재 폴더 안에 해당 id가 폴더인지 확인
      const curFolder = findFolderByPath(root, currentPath);
      const target = curFolder?.children?.find((c) => c.id === id);
      if (!target || target.type !== "folder") return;

      get().navigateTo([...currentPath, id]);
    },

    upOneLevel: () => {
      const { currentPath, navigateTo } = get();
      if (currentPath.length === 0) return;
      navigateTo(currentPath.slice(0, -1));
    },

    goBack: () => {
      const { backStack, currentPath, forwardStack } = get();
      if (backStack.length === 0) return;
      const prev = backStack[backStack.length - 1];
      set({
        currentPath: prev,
        backStack: backStack.slice(0, -1),
        forwardStack: [currentPath, ...forwardStack],
        selectedIds: {},
      });
    },

    goForward: () => {
      const { forwardStack, currentPath, backStack } = get();
      if (forwardStack.length === 0) return;
      const next = forwardStack[0];
      set({
        currentPath: next,
        backStack: [...backStack, currentPath],
        forwardStack: forwardStack.slice(1),
        selectedIds: {},
      });
    },

    resetToRoot: () =>
      set({
        currentPath: [],
        backStack: [],
        forwardStack: [],
        selectedIds: {},
      }),

    // --- selection ---
    toggleSelect: (id) => {
      set((s) => {
        const next = { ...s.selectedIds };
        if (next[id]) delete next[id];
        else next[id] = true;
        return { selectedIds: next };
      });
    },
    clearSelection: () => set({ selectedIds: {} }),

    // --- view mode (경로별) ---
    setViewMode: (mode) => {
      const key = pathKey(get().currentPath);
      set((s) => ({ viewModeByPath: { ...s.viewModeByPath, [key]: mode } }));
    },
  })
);

// ===== 파생 셀렉터 예시 =====
export const useCurrentEntries = () =>
  useExplorer((s) => {
    const folder = findFolderByPath(s.root, s.currentPath);
    return folder?.children ?? [];
  }, shallow);

export const useBreadcrumbs = () =>
  useExplorer((s) => {
    // id -> name 매핑
    const names: { id: string; name: string }[] = [];
    let acc: Path = [];
    for (const id of s.currentPath) {
      acc = [...acc, id];
      const node = findById(s.root, id);
      if (node) names.push({ id, name: node.name });
    }
    return names; // [{id,name}, ...]
  });

export const useViewMode = () =>
  useExplorer((s) => s.viewModeByPath[pathKey(s.currentPath)] ?? "grid");
