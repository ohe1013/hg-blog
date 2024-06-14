"use client";
import { ReactNode, createContext, useContext, useRef } from "react";
import { State, useWindow } from "../hooks/useWindow";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import { DefaultApplicationKey } from "../../../zustand/application/applicationStore";
import { useRouter } from "next/navigation";
import "../style/index.scss";

interface Props {
  children: ReactNode;
}

const WindowContext = createContext<{
  context?: State;
  isFull: boolean;
  onFullSizeToggle: any;
  closeApplication: any;
  touchUsedApplication: any;
  title: DefaultApplicationKey;
}>({
  isFull: false,
  title: "computer",
  onFullSizeToggle: () => {},
  closeApplication: () => {},
  touchUsedApplication: () => {},
});

interface WindowProps {
  title: DefaultApplicationKey;
  children: ReactNode;
}

const Window = ({ children, title }: WindowProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { closeApplication, touchUsedApplication, application } = useApplicationStore(
    (state) => state
  );
  const { state, onMouseDown, borderMouseMove, isFull, onFullSizeToggle } = useWindow({ ref });

  return (
    <WindowContext.Provider
      value={{
        context: state,
        isFull,
        onFullSizeToggle,
        title,
        closeApplication: () => closeApplication(title),
        touchUsedApplication: () => touchUsedApplication(title),
      }}
    >
      <div
        ref={ref}
        onClick={() => touchUsedApplication(title)}
        onMouseMove={borderMouseMove}
        onMouseDown={!isFull ? onMouseDown : (e) => {}}
        className={"window absolute"}
        style={{ zIndex: application[title]?.zIndex }}
      >
        {children}
      </div>
    </WindowContext.Provider>
  );
};

const WindowResizeHeader = () => {
  const { isFull, onFullSizeToggle, closeApplication, title } = useContext(WindowContext);
  const { application } = useApplicationStore((state) => state);
  const maxZIndex = Math.max(...Object.values(application).map((item) => item.zIndex));
  const router = useRouter();
  return (
    <div
      className={"title-bar " + (maxZIndex !== application[title].zIndex ? "inactive" : "")}
      onDoubleClick={onFullSizeToggle}
    >
      <div className="title-bar-text">
        <div
          style={{ backgroundImage: `url(${application[title].miniIconUrl})` }}
          className="WindowHeader__icon"
        ></div>
        {title}
      </div>
      <div className="title-bar-controls">
        <button aria-label="Minimize" />
        <button aria-label={isFull ? "Restore" : "Maximize"} onClick={onFullSizeToggle} />
        <button
          aria-label="Close"
          onClick={() => {
            closeApplication();
            router.push("/");
          }}
        />
      </div>
    </div>
  );
};
const WindowBody = (props: { children: ReactNode }) => {
  const { context } = useContext(WindowContext);
  const height =
    context!.size.height.indexOf("%") > -1
      ? context?.size.height
      : Number(context?.size.height.slice(0, -2)) - 50 + "px";
  return (
    <div className="overflow-y-auto" style={{ height: height }}>
      {props.children}
    </div>
  );
};

const WindowStatus = () => {
  return (
    <div className="status-bar">
      <p className="status-bar-field">Press F1 for help</p>
      <p className="status-bar-field">Slide 1</p>
      <p className="status-bar-field">CPU Usage: 14%</p>
    </div>
  );
};

export { Window, WindowResizeHeader, WindowBody, WindowStatus };
