"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, useStore } from "zustand";

import { type ApplicationStore, createApplicationStore } from "./applicationStore";

export const ApplicationStoreContext = createContext<StoreApi<ApplicationStore> | null>(null);

export interface ApplicationStoreProviderProps {
  children: ReactNode;
}

export const ApplicationStoreProvider = ({ children }: ApplicationStoreProviderProps) => {
  const storeRef = useRef<StoreApi<ApplicationStore>>();
  if (!storeRef.current) {
    storeRef.current = createApplicationStore();
  }

  return (
    <ApplicationStoreContext.Provider value={storeRef.current}>
      {children}
    </ApplicationStoreContext.Provider>
  );
};

export const useApplicationStore = <T,>(selector: (store: ApplicationStore) => T): T => {
  const applicationStoreContext = useContext(ApplicationStoreContext);

  if (!applicationStoreContext) {
    throw new Error(`useApplicationStore must be use within ApplicationStoreProvider`);
  }

  return useStore(applicationStoreContext, selector);
};
