"use client";
import {
  Window,
  WindowBody,
  WindowMenuBar,
  WindowResizeHeader,
  WindowStatus,
} from "../../features/window/components";
import { Fragment, ReactNode } from "react";
import { useApplicationStore } from "../../zustand/application/applicationProvider";
export default function ClientAboutLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { about } = useApplicationStore((state) => state.application);
  return (
    <Fragment>
      {about.useApplication && (
        <Window title="about">
          <WindowResizeHeader></WindowResizeHeader>
          <WindowMenuBar />
          <WindowBody>{children}</WindowBody>
          <WindowStatus></WindowStatus>
        </Window>
      )}
    </Fragment>
  );
}
