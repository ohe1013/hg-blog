import {
  Window,
  WindowBody,
  WindowMenuBar,
  WindowResizeHeader,
  WindowStatus,
} from "../../features/window/components";
import { ReactNode } from "react";
import BlogWrapper from "./BlogWrapper";
export default async function BlogLayout({
  children,
}: {
  children: ReactNode;
}) {
  console.log("layout rerender");
  return (
    <BlogWrapper>
      <Window title="blog">
        <WindowResizeHeader></WindowResizeHeader>
        <WindowMenuBar />
        <WindowBody>{children}</WindowBody>
        <WindowStatus></WindowStatus>
      </Window>
    </BlogWrapper>
  );
}
