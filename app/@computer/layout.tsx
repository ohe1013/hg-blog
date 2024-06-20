import {
  Window,
  WindowBody,
  WindowMenuBar,
  WindowResizeHeader,
  WindowSideBar,
  WindowStatus,
} from "../../features/window/components";
import { ReactNode } from "react";
import ComputerWrapper from "./ComputerWrapper";
export default async function ComputerLayout({ children }: { children: ReactNode }) {
  return (
    <ComputerWrapper>
      <Window title="computer">
        <WindowResizeHeader />
        <WindowMenuBar />
        <WindowBody>
          <WindowSideBar />
          {children}
        </WindowBody>
        <WindowStatus></WindowStatus>
      </Window>
    </ComputerWrapper>
  );
}
