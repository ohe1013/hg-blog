import {
  Window,
  WindowBody,
  WindowMenuBar,
  WindowResizeHeader,
  WindowSideBar,
  WindowStatus,
} from "../../features/window/components";
import { ReactNode } from "react";
import BlogWrapper from "./ComputerWrapper";
export default async function ComputerLayout({ children }: { children: ReactNode }) {
  return (
    <BlogWrapper>
      <Window title="computer">
        <WindowResizeHeader />
        <WindowMenuBar />
        <WindowBody>
          <WindowSideBar />
          {children}
        </WindowBody>
        <WindowStatus></WindowStatus>
      </Window>
    </BlogWrapper>
  );
}
