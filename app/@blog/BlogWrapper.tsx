"use client";
import { Fragment, ReactNode } from "react";
import { useApplicationStore } from "../../zustand/application/applicationProvider";

export default function BlogWrapper({ children }: { children: ReactNode }) {
  const { blog } = useApplicationStore((state) => state);
  return <Fragment>{blog.useApplication === true ? children : null}</Fragment>;
}
