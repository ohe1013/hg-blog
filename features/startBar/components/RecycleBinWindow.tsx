"use client";

import { useMemo, useState } from "react";
import Button from "@lib/components/Button";
import {
  Window,
  WindowBody,
  WindowMenuBar,
  WindowResizeHeader,
  WindowStatus,
} from "@features/window/components";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";

interface RecycleBinWindowProps {
  winId: string;
}

const formatDeletedAt = (timestamp: number) =>
  new Date(timestamp).toLocaleString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function RecycleBinWindow({ winId }: RecycleBinWindowProps) {
  const {
    getById,
    close,
    apps,
    recycleBinItems,
    restoreFromRecycleBin,
    emptyRecycleBin,
  } = useApplicationStore((s) => s);
  const win = getById(winId);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const menus = useMemo(
    () => [
      {
        label: "File",
        key: "file",
        items: [
          {
            label: "Restore",
            onClick: () => {
              if (!selectedApp) return;
              restoreFromRecycleBin(selectedApp);
              setSelectedApp(null);
            },
            disabled: !selectedApp,
          },
          {
            label: "Empty Recycle Bin",
            onClick: emptyRecycleBin,
            disabled: recycleBinItems.length === 0,
          },
          { label: "Close", onClick: () => close(winId) },
        ],
      },
    ],
    [
      close,
      emptyRecycleBin,
      recycleBinItems.length,
      restoreFromRecycleBin,
      selectedApp,
      winId,
    ],
  );

  if (!win) return null;

  return (
    <Window
      winId={winId}
      initialWidth="560px"
      initialHeight="420px"
      initialX="14%"
      initialY="10%"
    >
      <WindowResizeHeader />
      <WindowMenuBar menus={menus} />
      <WindowBody
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#c0c0c0",
          padding: "8px",
          gap: "8px",
        }}
      >
        <p className="RecycleBinWindow__hint text-xs">
          Recycle Bin stores deleted desktop shortcuts. Restore them when
          needed.
        </p>

        {recycleBinItems.length === 0 ? (
          <div className="window RecycleBinWindow__empty p-3 text-xs">
            Recycle Bin is empty.
          </div>
        ) : (
          <div
            className="window RecycleBinWindow__list"
            style={{ flex: 1, overflowY: "auto", padding: "4px" }}
          >
            {recycleBinItems.map((item) => {
              const appMeta = apps[item.app];
              const label = appMeta?.label ?? item.app;
              const iconUrl = appMeta?.miniIconUrl ?? appMeta?.iconUrl;
              const selected = selectedApp === item.app;
              return (
                <button
                  key={`${item.app}-${item.deletedAt}`}
                  className="RecycleBinWindow__item w-full text-left"
                  style={{
                    background: selected ? "#000080" : "transparent",
                    color: selected ? "#fff" : "#000",
                  }}
                  onClick={() => setSelectedApp(item.app)}
                  onDoubleClick={() => {
                    restoreFromRecycleBin(item.app);
                    setSelectedApp(null);
                  }}
                >
                  <div className="RecycleBinWindow__itemMain">
                    {iconUrl ? (
                      <span
                        className="RecycleBinWindow__itemIcon"
                        style={{ backgroundImage: `url(${iconUrl})` }}
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="RecycleBinWindow__itemText">
                      <div className="RecycleBinWindow__itemLabel text-xs">
                        {label}
                      </div>
                      <div className="RecycleBinWindow__itemDate text-[11px]">
                        Deleted: {formatDeletedAt(item.deletedAt)}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="ml-auto flex gap-2">
          <Button
            type="button"
            disabled={!selectedApp}
            onClick={() => {
              if (!selectedApp) return;
              restoreFromRecycleBin(selectedApp);
              setSelectedApp(null);
            }}
          >
            Restore
          </Button>
          <Button
            type="button"
            disabled={recycleBinItems.length === 0}
            onClick={() => {
              emptyRecycleBin();
              setSelectedApp(null);
            }}
          >
            Empty Bin
          </Button>
        </div>
      </WindowBody>
      <WindowStatus />
    </Window>
  );
}
