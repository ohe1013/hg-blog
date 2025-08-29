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
export default function ClientBlogLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { blog } = useApplicationStore((state) => state.application);
  return (
    <Fragment>
      {blog.useApplication && (
        <Window title="blog">
          <WindowResizeHeader></WindowResizeHeader>
          <WindowMenuBar />
          <WindowBody>{children}</WindowBody>
          <WindowStatus></WindowStatus>
        </Window>
      )}
    </Fragment>
  );
}
