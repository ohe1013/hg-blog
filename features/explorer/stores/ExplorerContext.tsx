import { createContext, useContext, useRef } from "react";
import { create, StoreApi, useStore } from "zustand";
import { FileId, FileSystem, FsNode } from "../../fs/types";
import { initialFs } from "../../fs/data/initialFs";

type ExplorerState = {
  fs: FileSystem;
  currentId: FileId;
  selectedIds: FileId[];
  backStack: FileId[];
  forwardStack: FileId[];

  // Actions
  open: (id: FileId) => void;
  enter: (id: FileId) => void;
  back: () => void;
  forward: () => void;
  up: () => void;
  goBackTo: (id: FileId) => void;
  isRoot: () => boolean;
};

import { ArticlePost } from "@features/notion/api";

export const createExplorerStore = (
  initialRootId: FileId,
  initialPosts?: ArticlePost[]
) => {
  let fs = { ...initialFs };

  if (initialPosts && initialPosts.length > 0) {
    const articleFolder = fs.byId["articles"];
    if (articleFolder && articleFolder.kind === "folder") {
      // Create file nodes for each post
      const postNodes: Record<FileId, FsNode> = {};
      const postIds: FileId[] = [];

      initialPosts.forEach((post) => {
        const id = post.pageId;
        postIds.push(id);
        postNodes[id] = {
          id,
          name: post.title,
          kind: "file",
          type: "notepad", // Using notepad type for now to reuse icon/viewer
          app: "article-viewer",
          parentId: "articles",
          iconUrl: "https://win98icons.alexmeub.com/icons/png/notepad-2.png",
          payload: { pageId: post.pageId, slug: post.slug },
        };
      });

      // Update fs
      fs = {
        ...fs,
        byId: {
          ...fs.byId,
          ...postNodes,
          articles: {
            ...articleFolder,
            children: [...articleFolder.children, ...postIds],
          },
        },
      };
    }
  }

  return create<ExplorerState>((set, get) => ({
    fs,
    currentId: initialRootId,
    selectedIds: [],
    backStack: [],
    forwardStack: [],

    open: (id) => {
      const { fs, currentId, backStack } = get();
      const node = fs.byId[id];
      if (!node) return;

      if (node.kind === "folder") {
        if (currentId !== id) {
          set({
            currentId: id,
            selectedIds: [],
            backStack: [...backStack, currentId],
            forwardStack: [],
          });
        }
      } else {
        set({ currentId: id });
      }
    },

    enter: (id) => get().open(id),

    back: () => {
      const { backStack, currentId, forwardStack } = get();
      if (backStack.length === 0) return;

      const prev = backStack[backStack.length - 1];
      const newBack = backStack.slice(0, -1);

      set({
        currentId: prev,
        backStack: newBack,
        forwardStack: [currentId, ...forwardStack],
        selectedIds: [],
      });
    },

    forward: () => {
      const { forwardStack, currentId, backStack } = get();
      if (forwardStack.length === 0) return;

      const next = forwardStack[0];
      const newForward = forwardStack.slice(1);

      set({
        currentId: next,
        backStack: [...backStack, currentId],
        forwardStack: newForward,
        selectedIds: [],
      });
    },

    up: () => {
      const { fs, currentId, open } = get();
      const node = fs.byId[currentId];
      if (!node) return;
      if (!node.parentId) return;
      open(node.parentId);
    },

    goBackTo: (id) => {
      const { backStack, currentId, forwardStack } = get();
      const index = backStack.lastIndexOf(id);
      if (index === -1) return;

      const intermediate = backStack.slice(index + 1);
      const newForward = [...intermediate, currentId, ...forwardStack];
      const newBack = backStack.slice(0, index);

      set({
        currentId: id,
        backStack: newBack,
        forwardStack: newForward,
        selectedIds: [],
      });
    },

    isRoot: () => {
      const { currentId } = get();
      const node = get().fs.byId[currentId];
      return !node.parentId;
    },
  }));
};

type ExplorerStore = ReturnType<typeof createExplorerStore>;

const ExplorerContext = createContext<ExplorerStore | null>(null);

export const ExplorerProvider = ({
  children,
  initialId,
  initialPosts,
}: {
  children: React.ReactNode;
  initialId: FileId;
  initialPosts?: ArticlePost[];
}) => {
  const storeRef = useRef<ExplorerStore>();
  if (!storeRef.current) {
    storeRef.current = createExplorerStore(initialId, initialPosts);
  }

  return (
    <ExplorerContext.Provider value={storeRef.current}>
      {children}
    </ExplorerContext.Provider>
  );
};

export const useExplorerContext = <T,>(
  selector: (state: ExplorerState) => T
): T => {
  const store = useContext(ExplorerContext);
  if (!store) {
    throw new Error("useExplorerContext must be used within ExplorerProvider");
  }
  return useStore(store, selector);
};
