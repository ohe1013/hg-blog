import {
  Window,
  WindowBody,
  WindowResizeHeader,
  WindowStatus,
} from "../../features/window/components";
import { ReactNode } from "react";
import BlogWrapper from "./BlogWrapper";
export default async function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <BlogWrapper>
      <Window>
        <WindowResizeHeader title="blog"></WindowResizeHeader>
        <WindowBody>{children}</WindowBody>
        <WindowStatus></WindowStatus>
      </Window>
    </BlogWrapper>
  );
}
