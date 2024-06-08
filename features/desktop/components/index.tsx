"use client";
import { ReactNode } from "react";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";

const Desktop = ({ children }: { children: ReactNode }) => {
  return <div className={"bg-teal-600 h-dvh w-full overflow-hidden"}>{children}</div>;
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
  const applications = applicationStore.getApplications();
  return (
    <div className="absolute">
      {applications.map((application) => (
        <DesktopIcon
          key={applicationStore[application].label}
          label={applicationStore[application].label}
          iconUrl={applicationStore[application].iconUrl}
          onDoubleClick={() => applicationStore.openApplication(application)}
        />
      ))}
    </div>
  );
};

type DesktopIconProps = { label: string; iconUrl: string; onDoubleClick: any };

const DesktopIcon = (props: DesktopIconProps) => {
  const { label, iconUrl, onDoubleClick } = props;
  return (
    <div
      onDoubleClick={onDoubleClick}
      className={
        "text-center align-top z-0 w-[72px] leading-3 m-0 py-[8px] px-[1px] cursor-pointer active:"
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

export { Desktop, DesktopIconGrid, DesktopIcon };
