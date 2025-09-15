"use client";
import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, useStore } from "zustand";
import { shallow } from "zustand/shallow"; // 선택

import { ApplicationStore, createApplicationStore } from "./applicationStore";

export const ApplicationStoreContext =
  createContext<StoreApi<ApplicationStore> | null>(null);

export function ApplicationStoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  const storeRef = useRef<StoreApi<ApplicationStore>>();
  if (!storeRef.current) storeRef.current = createApplicationStore();
  return (
    <ApplicationStoreContext.Provider value={storeRef.current}>
      {children}
    </ApplicationStoreContext.Provider>
  );
}

// equalityFn을 옵션으로 받을 수 있게
export function useApplicationStore<T>(
  selector: (s: ApplicationStore) => T,
  equalityFn?: (a: T, b: T) => boolean
): T {
  const ctx = useContext(ApplicationStoreContext);
  if (!ctx)
    throw new Error(
      "useApplicationStore must be used within ApplicationStoreProvider"
    );
  return useStore(ctx, selector, equalityFn ?? shallow); // shallow는 선택
}
