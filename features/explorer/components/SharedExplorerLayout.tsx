"use client";
import { Fragment } from "react";
import {
  Window,
  WindowAddressBar,
  WindowBody,
  WindowMainBody,
  WindowMenuBar,
  WindowResizeHeader,
  WindowSideBar,
  WindowStatus,
} from "@features/window/components";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import { useDragSelect } from "@lib/hooks/useDrag";
import { ExplorerGridContainer } from "@features/explorer/components/ExplorerGrid";
import { ExplorerProvider } from "@features/explorer/stores/ExplorerContext";
import SharedExplorerSidebar from "@features/explorer/components/SharedExplorerSidebar";
import { ArticlePost } from "@features/notion/api";

interface SidebarConfig {
  iconUrl: string;
  title: string;
  defaultInfo: string;
  iconStyle?: React.CSSProperties;
}

interface SharedExplorerLayoutProps {
  winId: string;
  explorerId: string;
  sidebarConfig: SidebarConfig;
  initialPosts?: ArticlePost[];
}

export default function SharedExplorerLayout({
  winId,
  explorerId,
  sidebarConfig,
  initialPosts,
}: SharedExplorerLayoutProps) {
  const { getById } = useApplicationStore((s) => s);
  const win = getById(winId);

  const {
    containerRef,
    selection,
    bindMouseDown,
    SelectionRect,
    itemRefs,
    selectedIds,
    setSelectedIds,
  } = useDragSelect<string>();

  if (!win) return null;

  return (
    <Fragment>
      <ExplorerProvider initialId={explorerId} initialPosts={initialPosts}>
        <Window winId={winId}>
          <WindowResizeHeader />
          <WindowMenuBar />
          <WindowAddressBar />
          <WindowBody style={{ display: "flex" }}>
            <WindowSideBar>
              <SharedExplorerSidebar
                iconUrl={sidebarConfig.iconUrl}
                title={sidebarConfig.title}
                defaultInfo={sidebarConfig.defaultInfo}
                selectedIds={selectedIds}
                iconStyle={sidebarConfig.iconStyle}
              />
            </WindowSideBar>
            <WindowMainBody>
              <ExplorerGridContainer
                containerRef={containerRef}
                onMouseDown={bindMouseDown}
                itemRefs={itemRefs}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
              />
            </WindowMainBody>
          </WindowBody>
          <WindowStatus />
        </Window>
        {selection.visible && (
          <SelectionRect
            x={selection.x}
            y={selection.y}
            w={selection.w}
            h={selection.h}
          />
        )}
      </ExplorerProvider>
    </Fragment>
  );
}
