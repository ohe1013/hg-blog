"use client";
import { ReactNode } from "react";

const Desktop = ({ children }: { children: ReactNode }) => {
  return (
    <div className={"bg-teal-600 h-dvh w-full overflow-hidden"}>{children}</div>
  );
};

const computerIcon = {
  computer: {
    label: "Computer",
    iconUrl: "https://win98icons.alexmeub.com/images/computer_explorer-2.png",
  },
  document: {
    label: "Documents",
    iconUrl: "https://win98icons.alexmeub.com/images/directory_closed-3.png",
  },
};

type DesktopIconProps = { type: keyof typeof computerIcon };

const DesktopIcon = (props: DesktopIconProps) => {
  const { label, iconUrl } = computerIcon[props.type];
  return (
    <div
      className={
        "absolute text-center align-top z-0 w-[72px] leading-3 m-0 py-[8px] px-[1px] cursor-pointer active:"
      }
    >
      <div className={"relative box-border"}>
        <div
          style={{ backgroundImage: `url(${iconUrl})` }}
          className={`w-8 h-8 m-auto 
        selection:bg-blue-500}`}
        ></div>
        {/* <img className={"m-auto selection:bg-gray-900"} width={32} height={32} src={iconUrl} /> */}
        <span className={"text-white select-none"}>{label}</span>
      </div>
    </div>
  );
};

export { Desktop, DesktopIcon };
