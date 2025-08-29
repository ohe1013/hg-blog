import { ReactNode } from "react";
import ClientBlogLayout from "./ClientBlogLayout";
export default function BlogLayout({ children }: { children: ReactNode }) {
  return <ClientBlogLayout>{children}</ClientBlogLayout>;
}
