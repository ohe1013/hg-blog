import {
  Window,
  WindowAddressBar,
  WindowBody,
  WindowMainBody,
  WindowMenuBar,
  WindowResizeHeader,
  WindowSideBar,
  WindowStatus,
} from "../../features/window/components";
import { ReactNode } from "react";
import ComputerWrapper from "./ComputerWrapper";
export default async function ComputerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ComputerWrapper>{children}</ComputerWrapper>;
}
