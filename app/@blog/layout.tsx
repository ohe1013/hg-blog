import {
  Window,
  WindowBody,
  WindowResizeHeader,
} from "../../features/window/components";
import { ReactNode } from "react";
export default async function Blog({ children }: { children: ReactNode }) {
  return (
    <Window>
      <WindowResizeHeader title="notion" type="resize"></WindowResizeHeader>
      <WindowBody>{children}</WindowBody>
    </Window>
  );
}
