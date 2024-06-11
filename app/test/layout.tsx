import {
  Window,
  WindowBody,
  WindowResizeHeader,
  WindowStatus,
} from "../../features/window/components";
import { ReactNode } from "react";
import BlogWrapper from "./BlogWrapper";
export default async function BlogLayout({ children }: { children: ReactNode }) {
  console.log("layout rerender");
  return (
    <Window>
      <WindowResizeHeader title="blog"></WindowResizeHeader>
      <WindowBody>{children}</WindowBody>
      <WindowStatus></WindowStatus>
    </Window>
  );
}
