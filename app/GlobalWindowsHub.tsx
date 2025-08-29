"use client";

import { viewerRegistry } from "@features/explorer/viewers/registry";
import { useApplicationStore } from "../zustand/application/applicationProvider";

export function GlobalWindowsHub() {
  const apps = useApplicationStore((s) => s.application);
  const keys = useApplicationStore((s) => s.getApplicationKeys());
  const minimized = (k: string) => apps[k as keyof typeof apps].isMini;
  const opened = (k: string) => apps[k as keyof typeof apps].useApplication;
  return (
    <>
      {keys
        .filter((k) => apps[k].useApplication)
        .sort((a, b) => apps[a].zIndex - apps[b].zIndex)
        .map((k) => {
          const View = viewerRegistry[k];
          return <View key={k} />;
        })}
    </>
  );
}
