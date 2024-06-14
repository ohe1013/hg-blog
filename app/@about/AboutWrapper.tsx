"use client";
import { Fragment, ReactNode } from "react";
import { useApplicationStore } from "../../zustand/application/applicationProvider";

export default function AboutWrapper({ children }: { children: ReactNode }) {
  const { about } = useApplicationStore((state) => state.application);
  return <Fragment>{about.useApplication === true ? children : null}</Fragment>;
}
