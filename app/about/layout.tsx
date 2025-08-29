import { ReactNode } from "react";
import ClientAboutLayout from "./ClientAboutLayout";
export default async function Blog({ children }: { children: ReactNode }) {
  return <ClientAboutLayout>{children}</ClientAboutLayout>;
}
