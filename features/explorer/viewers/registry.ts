import React, { lazy } from "react";

export type ViewerProps = { file: import("../fs/types").FileNode };

export const viewerRegistry: Record<
  string,
  React.ComponentType<ViewerProps>
> = {
  "markdown-viewer": lazy(() => import("../components/Sample")),
  "image-viewer": lazy(() => import("../components/Sample")),
  "text-viewer": lazy(() => import("../components/Sample")),

  // ...
};
