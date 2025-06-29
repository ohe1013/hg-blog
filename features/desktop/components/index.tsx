"use client";
import { KeyboardEvent, ReactNode, Ref, useState } from "react";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import "../styles/index.scss";
import { useRouter } from "next/navigation";
import { DefaultApplicationKey } from "../../../zustand/application/applicationStore";
import { rootDir } from "@features/notion/data";

const Desktop = ({
  containerRef,
  children,
  onMouseDown,
}: {
  containerRef: Ref<HTMLDivElement>;
  children: ReactNode;
  onMouseDown: (e: React.MouseEvent) => void;
}) => {
  return (
    <div
      ref={containerRef}
      onMouseDown={onMouseDown}
      className={"bg-teal-600 h-dvh w-full overflow-hidden"}
    >
      {children}
    </div>
  );
};

type DesktopIconGridProps<T extends string> = {
  itemRefs: React.MutableRefObject<Record<T, HTMLDivElement | null>>;
  selectedIds: Set<T>;
};

function DesktopIconGrid<T extends DefaultApplicationKey>({
  itemRefs,
  selectedIds,
}: DesktopIconGridProps<T>) {
  const router = useRouter();
  const appStore = useApplicationStore((s) => s);
  const keys = appStore.getApplicationKeys() as T[];

  const handleDoubleClick = async (key: T) => {
    appStore.openApplication(key);
    if (key === "blog" && !appStore.getApplication(key).useApplication) {
      router.push(`/blog-detail/${rootDir.blog}`);
    } else if (
      key === "about" &&
      !appStore.getApplication(key).useApplication
    ) {
      router.push(`/about-detail/${rootDir.about}`);
    }
    // computer / document 는 경로가 없다면 그냥 열기만
  };

  return (
    <div className="absolute">
      {keys.map((key) => (
        <div
          key={key}
          data-key={key}
          ref={(el) => {
            // itemRefs.current[key]에 해당 DOM 노드 저장
            itemRefs.current[key] = el;
          }}
        >
          <DesktopIcon
            label={appStore.application[key].label}
            iconUrl={appStore.application[key].iconUrl}
            isSelected={selectedIds.has(key)}
            onDoubleClick={() => void handleDoubleClick(key)}
          />
        </div>
      ))}
    </div>
  );
}
type DesktopIconProps = {
  label: string;
  iconUrl: string;
  onDoubleClick: any;
  isSelected: any;
};

const DesktopIcon: React.FC<DesktopIconProps> = ({
  label,
  iconUrl,
  onDoubleClick,
  isSelected = false,
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const active = isFocus || isSelected;

  const handleKeyEnter = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      onDoubleClick();
    }
  };

  return (
    <div
      tabIndex={0}
      onClick={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onDoubleClick={() => {
        onDoubleClick();
        setIsFocus(false);
      }}
      onKeyDown={handleKeyEnter}
      className={`text-center align-top z-0 w-[72px] leading-3 m-0 py-[8px] px-[1px] ${
        active ? "active" : ""
      }`}
    >
      <div className="box-border">
        <div className="DesktopIcon__wrapper">
          <div
            className="DesktopIcon__item"
            style={{ backgroundImage: `url(${iconUrl})` }}
          />
          <div
            className={`DesktopIcon__item ${active ? "actived" : ""}`}
            style={{ maskImage: `url(${iconUrl})`, maskSize: "contain" }}
          />
        </div>
        <span className={`DesktopIcon__text ${active ? "actived" : ""}`}>
          {label}
        </span>
      </div>
    </div>
  );
};
export { Desktop, DesktopIconGrid, DesktopIcon };
