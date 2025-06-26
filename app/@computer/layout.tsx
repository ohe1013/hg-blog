import {
  Window,
  WindowAddressBar,
  WindowBody,
  WindowMenuBar,
  WindowResizeHeader,
  WindowSideBar,
  WindowStatus,
} from "../../features/window/components";
import { ReactNode } from "react";
import ComputerWrapper from "./ComputerWrapper";
import ExplorerLayout from "@features/explorer/components/ExplorerLayout";
export default async function ComputerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ComputerWrapper>
      <Window title="computer">
        <WindowResizeHeader />
        <WindowMenuBar />
        {/* <WindowAddressBar /> */}
        <WindowBody>
          <WindowSideBar />
          {children}
        </WindowBody>
        <WindowStatus />
      </Window>
    </ComputerWrapper>
  );
}
