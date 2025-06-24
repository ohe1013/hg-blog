"use client";
import { ReactNode, useState } from "react";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import "../styles/index.scss";
import { useRouter } from "next/navigation";
import { DefaultApplicationKey } from "../../../zustand/application/applicationStore";

const Desktop = ({ children }: { children: ReactNode }) => {
  return (
    <div className={"bg-teal-600 h-dvh w-full overflow-hidden"}>{children}</div>
  );
};

function DesktopIconGrid() {
  const router = useRouter(); // ex) 'ko'
  const appStore = useApplicationStore((s) => s);
  const keys = appStore.getApplicationKeys();

  const handleDoubleClick = async (key: DefaultApplicationKey) => {
    appStore.openApplication(key);
    if (key === "blog" && !appStore.getApplication(key).useApplication) {
      router.push(
        `/blog-detail/study-react-732f1b8600004f14bae67e6d115df05c`,
        undefined
      );
    } else if (
      key === "about" &&
      !appStore.getApplication(key).useApplication
    ) {
      router.push(
        `/about-detail/devloper-88d3fb4a1ab64838a9d755b69d7cb80e`,
        undefined
      );
    } else if (key === "computer") {
      router.push(``, undefined);
    } else if (key === "document") {
      router.push(``, undefined);
    }
  };

  return (
    <div className="absolute">
      {keys.map((key) => (
        <DesktopIcon
          key={key}
          label={appStore.application[key].label}
          iconUrl={appStore.application[key].iconUrl}
          onDoubleClick={() => void handleDoubleClick(key)}
        />
      ))}
    </div>
  );
}
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
        <span className={`DesktopIcon__text ${isFoucs ? "actived" : ""}`}>
          {label}
        </span>
      </div>
    </div>
  );
};

export { Desktop, DesktopIconGrid, DesktopIcon };
