import { ReactNode } from "react";

const Desktop = ({ children }: { children: ReactNode }) => {
  return <div className={"bg-teal-600 h-dvh w-full overflow-hidden"}>{children}</div>;
};

export { Desktop };
