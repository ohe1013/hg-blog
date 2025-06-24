"use client";
import { Fragment, ReactNode } from "react";
import { useApplicationStore } from "../../zustand/application/applicationProvider";

export default function DocumentWrapper({ children }: { children: ReactNode }) {
  const { document } = useApplicationStore((state) => state.application);
  return (
    <Fragment>{document.useApplication === true ? children : null}</Fragment>
  );
}
