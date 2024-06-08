import { Window, WindowBody, WindowResizeHeader } from "../../features/window/components";
import { ReactNode } from "react";
import AboutWrapper from "./AboutWrapper";
export default async function Blog({ children }: { children: ReactNode }) {
  return (
    <AboutWrapper>
      <Window>
        <WindowResizeHeader title="about"></WindowResizeHeader>
        <WindowBody>{children}</WindowBody>
      </Window>
    </AboutWrapper>
  );
}
