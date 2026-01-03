import React from "react";
import {
  Window,
  WindowBody,
  WindowMainBody,
  WindowResizeHeader,
  WindowStatus,
} from "../../window/components";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import Button from "@lib/components/Button";

interface ExternalLinkConfirmWindowProps {
  winId: string;
}

export default function ExternalLinkConfirmWindow({
  winId,
}: ExternalLinkConfirmWindowProps) {
  const { getById, close } = useApplicationStore((s) => s);
  const win = getById(winId);

  if (!win) return null;

  const url = win.params?.url;

  const handleConfirm = () => {
    if (url) {
      window.open(url, "_blank");
    }
    close(winId);
  };

  const handleCancel = () => {
    close(winId);
  };

  return (
    <Window
      winId={winId}
      initialWidth="auto"
      initialHeight="auto"
      initialX="center"
      initialY="5%"
    >
      <WindowResizeHeader />
      <WindowBody
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#c0c0c0",
        }}
      >
        <WindowMainBody>
          <div
            className="flex flex-col items-center justify-center p-4 gap-4 bg-silver h-full"
            style={{ width: "300px" }}
          >
            <div className="flex items-start gap-4 w-full">
              <div className="flex flex-col gap-2 flex-1">
                <p>You are about to visit an external website:</p>
                <p>Do you want to continue?</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-2 w-full">
              <Button onClick={handleConfirm} style={{ minWidth: "80px" }}>
                OK
              </Button>
              <Button onClick={handleCancel} style={{ minWidth: "80px" }}>
                Cancel
              </Button>
            </div>
          </div>
        </WindowMainBody>
      </WindowBody>
      {/* <WindowStatus /> */}
    </Window>
  );
}
