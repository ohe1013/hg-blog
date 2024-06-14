import {
  Window,
  WindowBody,
  WindowResizeHeader,
  WindowStatus,
} from "../../features/window/components";
import { ReactNode } from "react";
import BlogWrapper from "./ComputerWrapper";
export default async function ComputerLayout({ children }: { children: ReactNode }) {
  return (
    <BlogWrapper>
      <Window title="computer">
        <WindowResizeHeader></WindowResizeHeader>
        <WindowBody>{children}</WindowBody>
        <WindowStatus></WindowStatus>
      </Window>
    </BlogWrapper>
  );
}
