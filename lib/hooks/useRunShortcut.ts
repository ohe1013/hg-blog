"use client";

import { useEffect } from "react";
import { useApplicationStore } from "../../zustand/application/applicationProvider";

const isTypingElement = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || target.isContentEditable;
};

export const useRunShortcut = () => {
  const { open } = useApplicationStore((s) => s);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (!event.altKey || event.key.toLowerCase() !== "r") return;
      if (isTypingElement(event.target)) return;

      event.preventDefault();
      open("run-dialog");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);
};
