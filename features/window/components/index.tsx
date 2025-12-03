"use client";
import {
  MouseEventHandler,
  ReactNode,
  Ref,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  Fragment,
  memo,
} from "react";
import { State, useWindow } from "../hooks/useWindow";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import "../style/index.scss";
import Button from "@lib/components/Button";
import {
  useFileExplorerStore,
  useViewMode,
} from "../../../zustand/file/fileExplore";
import { useExplorer } from "@features/explorer/stores/fileExplorer";

// ---------- Context & Types ----------
type WindowCtx = {
  context?: State;
  isFull: boolean;
  onFullSizeToggle: MouseEventHandler<HTMLElement>;
  closeWindow: () => void;
  focusWindow: () => void;
  minimizeWindow: MouseEventHandler<HTMLElement>;
  moveHeader: MouseEventHandler<HTMLElement>;
  winId: string;
  ref: React.RefObject<HTMLElement>;
};

const WindowContext = createContext<WindowCtx>({
  isFull: false,
  winId: "",
  onFullSizeToggle: () => {},
  closeWindow: () => {},
  moveHeader: () => {},
  minimizeWindow: () => {},
  focusWindow: () => {},
  ref: { current: null },
});

interface WindowProps {
  /** 창 인스턴스 id */
  winId: string;
  children: ReactNode;
}

// ---------- Window ----------
const Window = memo(({ children, winId }: WindowProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const {
    state,
    onMouseDownBorder,
    onMouseDownHeader,
    setMouseCursor,
    onMiniToggle, // 필요 시 store 최소화 토글에 연결
    isFull,
    onFullSizeToggle, // 필요 시 store 최대화 토글에 연결
  } = useWindow({ ref });

  const { getById, apps, close, focus } = useApplicationStore((s) => s);
  const win = getById(winId);
  if (!win) return null; // 이미 닫혔을 수 있음

  const appMeta = apps[win.app];
  const zIndex = win.zIndex ?? 0;
  const ctxValue = useMemo<WindowCtx>(
    () => ({
      context: state,
      isFull, // 현재는 훅 로컬, 스토어와 동기화하려면 교체
      onFullSizeToggle,
      winId,
      closeWindow: () => close(winId),
      minimizeWindow: onMiniToggle, // 스토어로 바꾸려면 여기서 toggleMinimize(winId)
      focusWindow: () => focus(winId),
      moveHeader: onMouseDownHeader,
      ref,
    }),
    [
      state,
      isFull,
      onFullSizeToggle,
      winId,
      close,
      onMiniToggle,
      focus,
      onMouseDownHeader,
    ]
  );

  return (
    <WindowContext.Provider value={ctxValue}>
      <div
        tabIndex={0}
        ref={ref}
        onClick={() => focus(winId)}
        onMouseMove={!isFull ? setMouseCursor : undefined}
        onMouseDown={!isFull ? onMouseDownBorder : undefined}
        className="window flex flex-col absolute"
        style={{ zIndex }}
      >
        {children}
      </div>
    </WindowContext.Provider>
  );
});

// ---------- Header ----------
const WindowResizeHeader = () => {
  const {
    isFull,
    onFullSizeToggle,
    closeWindow,
    minimizeWindow,
    moveHeader,
    winId,
  } = useContext(WindowContext);

  const { getById, apps, windows } = useApplicationStore((s) => s);
  const win = getById(winId);
  if (!win) return null;

  const appMeta = apps[win.app];
  const zValues = windows.map((w) => w.zIndex ?? 0);
  const maxZIndex = zValues.length ? Math.max(...zValues) : 0;
  const myZ = win.zIndex ?? 0;

  return (
    <div
      className={`title-bar ${maxZIndex !== myZ ? "inactive" : ""}`}
      onMouseDown={!isFull ? moveHeader : undefined}
      onDoubleClick={onFullSizeToggle}
    >
      <div className="title-bar-text">
        <div
          style={{ backgroundImage: `url(${appMeta?.miniIconUrl ?? ""})` }}
          className="WindowHeader__icon"
        />
        {win.title}
      </div>
      <div className="title-bar-controls">
        <button aria-label="Minimize" onClick={minimizeWindow} />
        <button
          aria-label={isFull ? "Restore" : "Maximize"}
          onClick={onFullSizeToggle}
        />
        <button aria-label="Close" onClick={closeWindow} />
      </div>
    </div>
  );
};

// ---------- Menu ----------
const WindowMenuBar = () => {
  const { closeWindow } = useContext(WindowContext);
  const [active, setActive] = useState<"file" | "help" | "view" | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileBtnRef = useRef<HTMLButtonElement>(null);
  const helpBtnRef = useRef<HTMLButtonElement>(null);
  const viewBtnRef = useRef<HTMLButtonElement>(null);

  const onToggle = (menu: typeof active) =>
    setActive((prev) => (prev === menu ? null : menu));

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
          <span style={{ textDecoration: "underline" }}>F</span>ile
        </Button>
        <div className="StandardMenu">
          <div className="divider divider--group-0-start" />
          <div className="divider divider--group-0-end" />
          <div className="divider divider--group-1-start" />
          <div className="StandardMenuItem">
            <button
              className="StandardMenuItem__button btn"
              onMouseDown={(e) => e.preventDefault()}
              onClick={closeWindow}
            >
              Close
            </button>
          </div>
          <div className="divider divider--group-1-end" />
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
          <span style={{ textDecoration: "underline" }}>H</span>elp
        </Button>
        <div className="StandardMenu">
          <div className="divider divider--group-0-start" />
          <div className="StandardMenuItem">
            <button className="StandardMenuItem__button disabled">
              Help Topics
            </button>
          </div>
          <div className="divider divider--group-0-end" />
          <div className="StandardMenuItem">
            <button className="StandardMenuItem__button disabled">About</button>
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
          <span style={{ textDecoration: "underline" }}>V</span>iew
        </Button>
        <div className="StandardMenu">
          <div className="divider divider--group-0-start" />
          <div className="StandardMenuItem">
            <button className="StandardMenuItem__button disabled">
              This is Dummy
            </button>
          </div>
          <div className="divider divider--group-0-end" />
          <div className="StandardMenuItem">
            <button className="StandardMenuItem__button disabled">Sorry</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- AddressBar / Body / MainBody / SideBar / Status ----------
// ---------- AddressBar / Body / MainBody / SideBar / Status ----------
const WindowAddressBar = () => {
  const { back, forward, up, backStack, forwardStack } = useExplorer();

  const canBack = backStack.length > 0;
  const canForward = forwardStack.length > 0;

  return (
    <div className="WindowAddressBar" style={{ minHeight: "40px" }}>
      <button
        className="toolbar-button "
        style={{ boxShadow: "none", background: "none" }}
        onClick={back}
        disabled={!canBack}
      >
        <div
          className="icon back-button"
          style={{
            filter: !canBack ? "url(#disabled-inset-filter)" : undefined,
          }}
        ></div>
        <span className="label-text">Back</span>
      </button>
      <button
        className="toolbar-dropdown-button lightweight forward-dropdown-button"
        style={{ boxShadow: "none", background: "none" }}
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
        onClick={forward}
        disabled={!canForward}
      >
        <div
          className="icon forward-button"
          style={{
            filter: !canForward ? "url(#disabled-inset-filter)" : undefined,
          }}
        ></div>
        <span className="label-text">Forward</span>
      </button>
      <button
        className="toolbar-dropdown-button lightweight forward-dropdown-button"
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
        onClick={up}
      >
        <div className="icon up-button"></div>
        <span className="label-text">Up</span>
      </button>

      <div className="spacer" />
    </div>
  );
};

interface WindowBodyProps {
  children: ReactNode;
}
interface WindowBodyProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

const WindowBody = ({ children, style }: WindowBodyProps) => {
  return (
    <div
      className="WindowBody overflow-y-auto"
      style={{ flexGrow: 1, display: "flex", ...style }}
    >
      {children}
    </div>
  );
};

interface WindowMainBodyProps {
  containerRef?: Ref<HTMLDivElement>;
  onMouseDown?: (e: React.MouseEvent) => void;
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
        onMouseDown?.(e);
      }}
      ref={containerRef}
    >
      {children}
    </div>
  );
};

const WindowSideBar = ({ children }: { children: ReactNode }) => (
  <div
    className="WindowSideBar"
    style={{
      background: "url(https://98.js.org/src/WEB//wvleft.bmp) no-repeat white",
      visibility: "visible",
    }}
  >
    {children}
  </div>
);

const WindowStatus = () => (
  <div className="status-bar">
    <p className="status-bar-field">Press F1 for help</p>
    <p className="status-bar-field">Slide 1</p>
    <p className="status-bar-field">CPU Usage: 14%</p>
  </div>
);

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
