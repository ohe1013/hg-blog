"use client";
import {
  Fragment,
  MouseEventHandler,
  ReactNode,
  Ref,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { State, useWindow } from "../hooks/useWindow";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import { DefaultApplicationKey } from "../../../zustand/application/applicationStore";
import "../style/index.scss";
import Button from "@lib/components/Button";
import { useFileExplorerStore } from "../../../zustand/file/fileExplore";
type WindowCtx = {
  context?: State;
  isFull: boolean;
  onFullSizeToggle: MouseEventHandler<HTMLElement>;
  closeApplication: () => void;
  touchUsedApplication: () => void;
  minimizeApplication: MouseEventHandler<HTMLElement>;
  moveHeader: MouseEventHandler<HTMLElement>;
  title: DefaultApplicationKey;
  ref: React.RefObject<HTMLElement>;
};

const WindowContext = createContext<WindowCtx>({
  isFull: false,
  title: "computer",
  onFullSizeToggle: () => {},
  closeApplication: () => {},
  moveHeader: () => {},
  minimizeApplication: () => {},
  touchUsedApplication: () => {},
  ref: { current: null },
});
interface WindowProps {
  title: DefaultApplicationKey;
  children: ReactNode;
}
const noop = () => {};

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

  const ctxValue = useMemo<WindowCtx>(
    () => ({
      context: state,
      isFull,
      onFullSizeToggle,
      title,
      closeApplication: () => closeApplication(title),
      minimizeApplication: onMiniToggle,
      touchUsedApplication: () => touchUsedApplication(title),
      moveHeader: onMouseDownHeader,
      ref,
    }),
    [
      state,
      isFull,
      onFullSizeToggle,
      title,
      closeApplication,
      onMiniToggle,
      touchUsedApplication,
      onMouseDownHeader,
    ]
  );
  const zIndex = application[title]?.zIndex ?? 0;
  return (
    <WindowContext.Provider value={ctxValue}>
      <div
        tabIndex={0}
        ref={ref}
        onClick={() => touchUsedApplication(title)}
        onMouseMove={!isFull ? setMouseCursor : (e) => {}}
        onMouseDown={!isFull ? onMouseDownBorder : (e) => {}}
        className={"window flex flex-col"}
        style={{ zIndex }}
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
  const zValues = Object.values(application).map((a) => a.zIndex ?? 0);
  const maxZIndex = zValues.length ? Math.max(...zValues) : 0;
  const myZ = application[title]?.zIndex ?? 0;
  return (
    <div
      className={`title-bar ${maxZIndex !== myZ ? "inactive" : ""}`}
      onMouseDown={!isFull ? moveHeader : undefined}
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
  const [active, setActive] = useState<"file" | "help" | "view" | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileBtnRef = useRef<HTMLButtonElement>(null);
  const helpBtnRef = useRef<HTMLButtonElement>(null);
  const viewBtnRef = useRef<HTMLButtonElement>(null);

  const onToggle = (menu: typeof active) =>
    setActive((prev) => (prev === menu ? null : menu));

  // 키보드 단축키 & cleanup
  useEffect(() => {
    const parent = menuRef.current?.parentElement;
    if (!parent) return;

    const keydownHandler = (e: KeyboardEvent) => {
      if (e.code === "KeyF") {
        fileBtnRef.current?.focus();
        setActive("file");
      }
      if (e.code === "KeyH") {
        helpBtnRef.current?.focus();
        setActive("help");
      }
      if (e.code === "KeyV") {
        viewBtnRef.current?.focus();
        setActive("view");
      }
    };
    parent.addEventListener("keydown", keydownHandler);

    const clickAway = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setActive(null);
    };
    document.addEventListener("click", clickAway);

    return () => {
      parent.removeEventListener("keydown", keydownHandler);
      document.removeEventListener("click", clickAway);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className="WindowMenuBar"
      style={{ zIndex: 1000 }}
      role="menubar"
    >
      <div className="StandardMenuWrapper MenuBar__section WindowProgram__menu">
        <Button
          onClick={() => onToggle("file")}
          onMouseEnter={(e) =>
            active && (e.currentTarget as HTMLButtonElement).focus()
          }
          ref={fileBtnRef}
          className={active === "file" ? "active" : ""}
          aria-haspopup="menu"
          aria-expanded={active === "file"}
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
          onClick={() => onToggle("help")}
          onMouseEnter={(e) =>
            active && (e.currentTarget as HTMLButtonElement).focus()
          }
          ref={helpBtnRef}
          className={active === "help" ? "active" : ""}
          aria-haspopup="menu"
          aria-expanded={active === "help"}
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
      <div className="StandardMenuWrapper MenuBar__section WindowProgram__menu">
        <Button
          onClick={() => onToggle("view")}
          onMouseEnter={(e) =>
            active && (e.currentTarget as HTMLButtonElement).focus()
          }
          ref={viewBtnRef}
          className={active === "view" ? "active" : ""}
          aria-haspopup="menu"
          aria-expanded={active === "view"}
        >
          <span style={{ textDecoration: "underline" }}>V</span>
          iew
        </Button>
        <div className="StandardMenu">
          <div className="divider divider--group-0-start"></div>
          <div className="StandardMenuItem">
            <button
              className="StandardMenuItem__button disabled"
              value="Help Topics"
            >
              This is Dummy
            </button>
          </div>
          <div className="divider divider--group-0-end"></div>
          <div className="StandardMenuItem">
            <button
              className="StandardMenuItem__button disabled"
              value="About My Computer"
            >
              Sorry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const WindowToolBar = () => {
  return;
};
const WindowAddressBar = () => {
  const { currentPath, enterFolder, resetToRoot, goBack } =
    useFileExplorerStore();
  return (
    <div className="WindowAddressBar" style={{ minHeight: "40px" }}>
      <button
        className="toolbar-button "
        style={{ boxShadow: "none", background: "none" }}
        disabled
      >
        <div className="icon back-button"></div>
        <span className="label-text">Back</span>
      </button>
      <button
        className="toolbarw-dropdown-button lightweight forward-dropdown-button"
        style={{ boxShadow: "none", background: "none" }}
        disabled
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            fill: "currentColor",
            display: "inline-block",
            verticalAlign: "middle",
          }}
        >
          <path
            style={{ transform: "rotate(90deg)", transformOrigin: "center" }}
            d="m6 4 4 4-4 4z"
          ></path>
        </svg>
      </button>
      <button
        className="toolbar-button "
        style={{ boxShadow: "none", background: "none" }}
        disabled
      >
        <div className="icon forward-button"></div>
        <span className="label-text">Back</span>
      </button>
      <button
        className="toolbarw-dropdown-button lightweight forward-dropdown-button"
        style={{ boxShadow: "none", background: "none" }}
        disabled
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            fill: "currentColor",
            display: "inline-block",
            verticalAlign: "middle",
          }}
        >
          <path
            style={{ transform: "rotate(90deg)", transformOrigin: "center" }}
            d="m6 4 4 4-4 4z"
          ></path>
        </svg>
      </button>
      <button
        className="toolbar-button "
        style={{ boxShadow: "none", background: "none" }}
        disabled
      >
        <div className="icon up-button"></div>
        <span className="label-text">Up</span>
      </button>
      {currentPath.map((seg, i) => (
        <Fragment key={i}>
          <span> &gt; </span>
          <button onClick={() => enterFolder(seg)}>{seg}</button>
        </Fragment>
      ))}
    </div>
  );
};
interface WindowBodyProps {
  dragSelect?: boolean;
  children: ReactNode;
}
const WindowBody = ({ dragSelect = false, children }: WindowBodyProps) => {
  return (
    <div className="WindowBody overflow-y-auto" style={{ flexGrow: 1 }}>
      {children}
    </div>
  );
};
interface WindowMainBodyProps {
  dragSelect?: boolean;
  containerRef?: Ref<HTMLDivElement>;
  onMouseDown: (e: React.MouseEvent) => void;
  children: ReactNode;
}
const WindowMainBody = ({
  children,
  onMouseDown,
  containerRef,
}: WindowMainBodyProps) => {
  return (
    <div
      className="WindowMainBody"
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onMouseDown(e);
      }}
      ref={containerRef}
    >
      {children}
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
  WindowAddressBar,
  WindowMainBody,
};
