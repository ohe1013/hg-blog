"use client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { State, useWindow } from "../hooks/useWindow";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import { DefaultApplicationKey } from "../../../zustand/application/applicationStore";
import "../style/index.scss";
import Button from "@lib/components/Button";

const WindowContext = createContext<{
  context?: State;
  isFull: boolean;
  onFullSizeToggle: any;
  closeApplication: any;
  touchUsedApplication: any;
  minimizeApplication: any;
  moveHeader: any;
  title: DefaultApplicationKey;
  ref: any;
}>({
  isFull: false,
  title: "computer",
  onFullSizeToggle: () => {},
  closeApplication: () => {},
  moveHeader: () => {},
  minimizeApplication: () => {},
  touchUsedApplication: () => {},
  ref: null,
});

interface WindowProps {
  title: DefaultApplicationKey;
  children: ReactNode;
}

const Window = ({ children, title }: WindowProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const {
    state,
    onMouseDownBorder,
    onMouseDownHeader,
    setMouseCursor,
    onMiniToggle,
    isFull,
    onFullSizeToggle,
  } = useWindow({ ref });
  const { closeApplication, touchUsedApplication, application } =
    useApplicationStore((state) => state);
  return (
    <WindowContext.Provider
      value={{
        context: state,
        isFull,
        onFullSizeToggle,
        title,
        closeApplication: () => closeApplication(title),
        minimizeApplication: onMiniToggle,
        touchUsedApplication: () => touchUsedApplication(title),
        moveHeader: onMouseDownHeader,
        ref,
      }}
    >
      <div
        tabIndex={0}
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
  const {
    isFull,
    onFullSizeToggle,
    closeApplication,
    minimizeApplication,
    title,
    moveHeader,
  } = useContext(WindowContext);
  const { application } = useApplicationStore((state) => state);
  const maxZIndex = Math.max(
    ...Object.values(application).map((item) => item.zIndex)
  );
  return (
    <div
      className={
        "title-bar " +
        (maxZIndex !== application[title].zIndex ? "inactive" : "")
      }
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
        <button aria-label="Minimize" onClick={minimizeApplication} />
        <button
          aria-label={isFull ? "Restore" : "Maximize"}
          onClick={onFullSizeToggle}
        />
        <button
          aria-label="Close"
          onClick={() => {
            closeApplication();
          }}
        />
      </div>
    </div>
  );
};

const WindowMenuBar = () => {
  const { closeApplication } = useContext(WindowContext);
  const [active, setActive] = useState(false);
  const menuRef = useRef<HTMLMenuElement>(null);
  const fileButtonRef = useRef<HTMLButtonElement>(null);
  const helpButtonRef = useRef<HTMLButtonElement>(null);
  const onClickHandler = () => {
    setActive((active) => (active = !active));
  };
  const keydownHandler = (e: any) => {
    switch (e.code) {
      case "KeyF":
      case "Keyf": {
        fileButtonRef.current!.focus();
        setActive(true);
        break;
      }
      case "KeyH":
      case "Keyh": {
        helpButtonRef.current!.focus();
        setActive(true);
        break;
      }
    }
    const handler = (e: MouseEvent) => {
      if (
        e.target !== fileButtonRef.current &&
        e.target !== helpButtonRef.current
      ) {
        setActive(false);
        document.removeEventListener("click", handler);
      }
    };
    document.addEventListener("click", handler);
  };
  useEffect(() => {
    menuRef.current?.parentElement?.addEventListener("keydown", keydownHandler);
  }, []);

  return (
    <menu ref={menuRef} className="WindowMenuBar" style={{ zIndex: 1000 }}>
      <div className="StandardMenuWrapper MenuBar__section WindowProgram__menu">
        <Button
          onClick={onClickHandler}
          onMouseEnter={(e) => {
            if (active) {
              e.currentTarget.focus();
            }
          }}
          ref={fileButtonRef}
          className={active ? "active" : ""}
        >
          <span style={{ textDecoration: "underline" }}>F</span>
          ile
        </Button>
        <div className="StandardMenu">
          <div className="divider divider--group-0-start"></div>
          <div className="divider divider--group-0-end"></div>
          <div className="divider divider--group-1-start"></div>
          <div className="StandardMenuItem">
            <button
              className="StandardMenuItem__button btn"
              onMouseDown={(e) => e.preventDefault()}
              onClick={closeApplication}
            >
              Close
            </button>
          </div>
          <div className="divider divider--group-1-end"></div>
        </div>
      </div>
      <div className="StandardMenuWrapper MenuBar__section WindowProgram__menu">
        <Button
          onClick={onClickHandler}
          onMouseEnter={(e) => {
            if (active) {
              e.currentTarget.focus();
            }
          }}
          ref={helpButtonRef}
          className={active ? "active" : ""}
        >
          <span style={{ textDecoration: "underline" }}>H</span>
          elp
        </Button>
        <div className="StandardMenu">
          <div className="divider divider--group-0-start"></div>
          <div className="StandardMenuItem">
            <button
              className="StandardMenuItem__button disabled"
              value="Help Topics"
            >
              Help Topics
            </button>
          </div>
          <div className="divider divider--group-0-end"></div>
          <div className="StandardMenuItem">
            <button
              className="StandardMenuItem__button disabled"
              value="About My Computer"
            >
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
    <div
      className="overflow-y-auto"
      style={{ height: height, paddingTop: "27px" }}
    >
      {props.children}
    </div>
  );
};

const WindowSideBar = () => {
  return (
    <div
      className="WindowSideBar"
      style={{
        background:
          "url(https://98.js.org/src/WEB//wvleft.bmp) no-repeat white",
        visibility: "visible",
      }}
    >
      <p>
        <img
          draggable="false"
          src="https://98.js.org/images/icons/hard-disk-drive-32x32.png"
        />
      </p>
      <p className="Title">(C:)</p>
      <p className="LogoLine">
        <img
          src="https://98.js.org/src/WEB//wvline.gif"
          width="100%"
          height="1px"
        />
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

export {
  Window,
  WindowResizeHeader,
  WindowBody,
  WindowMenuBar,
  WindowSideBar,
  WindowStatus,
};
