import {
  Window,
  WindowBody,
  WindowResizeHeader,
  WindowStatus,
} from "../../features/window/components";
import { ReactNode } from "react";
export default async function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <Window>
      <WindowResizeHeader title="blog"></WindowResizeHeader>
      <WindowBody>{children}</WindowBody>
      <WindowStatus></WindowStatus>
    </Window>
  );
}
