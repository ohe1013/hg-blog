"use client";
import { ReactNode, useState } from "react";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import "../styles/index.scss";

const Desktop = ({ children }: { children: ReactNode }) => {
  return (
    <div className={"bg-teal-600 h-dvh w-full overflow-hidden"}>{children}</div>
  );
};

// const computerIcon = {
//   computer: {
//     label: "Computer",
//     iconUrl: "https://win98icons.alexmeub.com/images/computer_explorer-2.png",
//   },
//   document: {
//     label: "Documents",
//     iconUrl: "https://win98icons.alexmeub.com/images/directory_closed-3.png",
//   },
// };

const DesktopIconGrid = () => {
  const applicationStore = useApplicationStore((state) => state);
  const applicationKeyList = applicationStore.getApplications();
  return (
    <div className="absolute">
      {applicationKeyList.map((key) => (
        <DesktopIcon
          key={applicationStore.application[key].label}
          label={applicationStore.application[key].label}
          iconUrl={applicationStore.application[key].iconUrl}
          onDoubleClick={() => applicationStore.openApplication(key)}
        />
      ))}
    </div>
  );
};

type DesktopIconProps = { label: string; iconUrl: string; onDoubleClick: any };

const DesktopIcon = (props: DesktopIconProps) => {
  const { label, iconUrl, onDoubleClick } = props;
  const [isFoucs, setIsFocus] = useState(false);
  return (
    <div
      tabIndex={0}
      onClick={() => setIsFocus(true)}
      onBlur={() => {
        setIsFocus(false);
      }}
      onDoubleClick={onDoubleClick}
      className={
        "text-center align-top z-0 w-[72px] leading-3 m-0 py-[8px] px-[1px] active:"
      }
    >
      <div className={" box-border"}>
        <div className="DesktopIcon__wrapper">
          <div
            style={{ backgroundImage: `url(${iconUrl})` }}
            className={`DesktopIcon__item `}
          ></div>
          <div
            style={{ maskImage: `url(${iconUrl})`, maskSize: "contain" }}
            className={`DesktopIcon__item ${isFoucs ? "actived" : ""}`}
          ></div>
        </div>
        {/* <img className={"m-auto selection:bg-gray-900"} width={32} height={32} src={iconUrl} /> */}
        <span className={`DesktopIcon__text ${isFoucs ? "actived" : ""}`}>
          {label}
        </span>
      </div>
    </div>
  );
};

export { Desktop, DesktopIconGrid, DesktopIcon };
