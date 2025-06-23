import {
  Window,
  WindowBody,
  WindowMenuBar,
  WindowResizeHeader,
  WindowStatus,
} from "../../features/window/components";
import { ReactNode } from "react";
import AboutWrapper from "./AboutWrapper";
export default async function Blog({ children }: { children: ReactNode }) {
  return (
    <AboutWrapper>
      <Window title="about">
        <WindowResizeHeader />
        <WindowMenuBar />
        <WindowBody>{children}</WindowBody>
        <WindowStatus />
      </Window>
    </AboutWrapper>
  );
}
