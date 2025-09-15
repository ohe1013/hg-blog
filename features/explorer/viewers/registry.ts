import React, { lazy } from "react";

// export type ViewerProps = { file: import("../fs/types").FileNode };

export const viewerRegistry: Record<string, React.ComponentType> = {
  computer: lazy(() => import("@app/computer/ClientComputerLayout")),
  blog: lazy(() => import("@app/blog/ClientBlogLayout")),
  // ...
};
