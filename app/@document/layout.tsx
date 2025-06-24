import {
  Window,
  WindowBody,
  WindowMenuBar,
  WindowResizeHeader,
  WindowSideBar,
  WindowStatus,
} from "../../features/window/components";
import { ReactNode } from "react";
import DocumentWrapper from "./DocumentWrapper";
export default async function DocumentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DocumentWrapper>
      <Window title="document">
        <WindowResizeHeader />
        <WindowMenuBar />
        <WindowBody>
          <WindowSideBar />
          {children}
        </WindowBody>
        <WindowStatus />
      </Window>
    </DocumentWrapper>
  );
}
