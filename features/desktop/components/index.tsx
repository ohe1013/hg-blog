"use client";
import { ReactNode, useState } from "react";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import "../styles/index.scss";
import { useRouter } from "next/navigation";

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

function DesktopIconGrid() {
  const router = useRouter(); // ex) 'ko'
  const appStore = useApplicationStore((s) => s);
  const keys = appStore.getApplications(); // ['computer','document','blog','about']

  const handleDoubleClick = async (key: string) => {
    // 1) UI 토글
    appStore.openApplication(key as any);

    // 2) 클릭한 아이콘에 따라 URL 강제 이동
    if (key === "blog") {
      router.push(
        `/blog-detail/study-react-732f1b8600004f14bae67e6d115df05c`,
        undefined
      );
    } else if (key === "about") {
      router.push(
        `/about-detail/devloper-88d3fb4a1ab64838a9d755b69d7cb80e`,
        undefined
      );
    } else if (key === "computer") {
      router.push(``, undefined);
    }
    // document 같은 다른 아이콘도 동일하게 분기 처리...
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
        {/* <img className={"m-auto selection:bg-gray-900"} width={32} height={32} src={iconUrl} /> */}
        <span className={`DesktopIcon__text ${isFoucs ? "actived" : ""}`}>
          {label}
        </span>
      </div>
    </div>
  );
};

export { Desktop, DesktopIconGrid, DesktopIcon };
