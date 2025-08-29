import { ReactNode } from "react";

import ComputerClientLayout from "./ClientComputerLayout";
export default function ComputerLayout({ children }: { children: ReactNode }) {
  return <ComputerClientLayout>{children}</ComputerClientLayout>;
}
