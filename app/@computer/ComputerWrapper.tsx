"use client";
import { Fragment, ReactNode } from "react";
import { useApplicationStore } from "../../zustand/application/applicationProvider";

export default function ComputerWrapper({ children }: { children: ReactNode }) {
  const { computer } = useApplicationStore((state) => state.application);
  return (
    <Fragment>{computer.useApplication === true ? children : null}</Fragment>
  );
}
