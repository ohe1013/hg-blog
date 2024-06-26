"use client";
import { ReactNode, createContext, useContext, useRef, useState } from "react";
import { State, useWindow } from "../hooks/useWindow";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import { DefaultApplicationKey } from "../../../zustand/application/applicationStore";
import { useRouter } from "next/navigation";
import "../style/index.scss";
import Button from "@lib/components/Button";

const WindowContext = createContext<{
  context?: State;
  isFull: boolean;
  onFullSizeToggle: any;
  closeApplication: any;
  touchUsedApplication: any;
  moveHeader: any;
  title: DefaultApplicationKey;
}>({
  isFull: false,
  title: "computer",
  onFullSizeToggle: () => {},
  closeApplication: () => {},
  moveHeader: () => {},
  touchUsedApplication: () => {},
});

interface WindowProps {
  title: DefaultApplicationKey;
  children: ReactNode;
}

const Window = ({ children, title }: WindowProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { state, onMouseDownBorder, onMouseDownHeader, setMouseCursor, isFull, onFullSizeToggle } =
    useWindow({ ref });
  const { closeApplication, touchUsedApplication, application } = useApplicationStore(
    (state) => state
  );

  return (
    <WindowContext.Provider
      value={{
        context: state,
        isFull,
        onFullSizeToggle,
        title,
        closeApplication: () => closeApplication(title),
        touchUsedApplication: () => touchUsedApplication(title),
        moveHeader: onMouseDownHeader,
      }}
    >
      <div
        ref={ref}
        onClick={() => touchUsedApplication(title)}
        onMouseMove={!isFull ? setMouseCursor : (e) => {}}
        onMouseDown={!isFull ? onMouseDownBorder : (e) => {}}
        className={"window absolute"}
        style={{ zIndex: application[title]?.zIndex }}
      >
        {children}
      </div>
    </WindowContext.Provider>
  );
};

const WindowResizeHeader = () => {
  const { isFull, onFullSizeToggle, closeApplication, title, moveHeader } =
    useContext(WindowContext);
  const { application } = useApplicationStore((state) => state);
  const maxZIndex = Math.max(...Object.values(application).map((item) => item.zIndex));
  const router = useRouter();
  return (
    <div
      className={"title-bar " + (maxZIndex !== application[title].zIndex ? "inactive" : "")}
      onMouseDown={!isFull ? moveHeader : () => {}}
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

const WindowMenuBar = () => {
  const { closeApplication } = useContext(WindowContext);
  const [active, setActive] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const blurEvtHandler = (e: MouseEvent) => {
    if (e.target instanceof HTMLElement) {
      if (e.target.id !== buttonRef.current!.id) {
        buttonRef.current?.blur();
        document.body.removeEventListener("click", blurEvtHandler);
      }
    }
  };
  const focusHandler = () => {
    setActive((active) => (active = !active));
    document.body.addEventListener("click", blurEvtHandler);
    buttonRef.current?.focus();
  };
  const blurHandler = () => {
    setActive(false);
  };
  return (
    <menu className="WindowMenuBar">
      <div className="StandardMenuWrapper MenuBar__section WindowProgram__menu">
        <Button
          id={"focusHandler"}
          ref={buttonRef}
          className={active ? "active" : ""}
          onClick={focusHandler}
          onBlur={blurHandler}
        >
          File
        </Button>
        <div className="Frame StandardMenu renderedMenu">
          <div className="divider divider--group-0-start"></div>
          <div className="divider divider--group-0-end"></div>
          <div className="divider divider--group-1-start"></div>
          <div className="StandardMenuItem">
            <button className="StandardMenuItem__button" onClick={() => closeApplication()}>
              Close
            </button>
          </div>
          <div className="divider divider--group-1-end"></div>
        </div>
      </div>
      <div className="StandardMenuWrapper MenuBar__section WindowProgram__menu">
        <button className="btn">Help</button>
        <div className="Frame StandardMenu renderedMenu">
          <div className="divider divider--group-0-start"></div>
          <div className="StandardMenuItem">
            <button className="StandardMenuItem__button disabled" value="Help Topics">
              Help Topics
            </button>
          </div>
          <div className="divider divider--group-0-end"></div>
          <div className="StandardMenuItem">
            <button className="StandardMenuItem__button disabled" value="About My Computer">
              About My Computer
            </button>
          </div>
        </div>
      </div>
    </menu>
  );
};
const WindowToolBar = () => {
  return;
};
const WindowAddressBar = () => {
  return;
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

const WindowSideBar = () => {
  return (
    <div
      className="WindowSideBar"
      style={{
        background: "url(https://98.js.org/src/WEB//wvleft.bmp) no-repeat white",
        visibility: "visible",
      }}
    >
      <p>
        <img draggable="false" src="https://98.js.org/images/icons/hard-disk-drive-32x32.png" />
      </p>
      <p className="Title">(C:)</p>
      <p className="LogoLine">
        <img src="https://98.js.org/src/WEB//wvline.gif" width="100%" height="1px" />
      </p>

      <p>
        <span id="Info">Select an item to view its description.</span>
      </p>
      <div id="Media"></div>
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

export { Window, WindowResizeHeader, WindowBody, WindowMenuBar, WindowSideBar, WindowStatus };
