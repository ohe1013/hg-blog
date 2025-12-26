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
  memo,
} from "react";
import { State, useWindow } from "../hooks/useWindow";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import "../style/index.scss";
import Button from "@lib/components/Button";

import { useExplorerContext } from "@features/explorer/stores/ExplorerContext";

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

interface WindowProps {
  /** 창 인스턴스 id */
  winId: string;
  children: ReactNode;
  initialWidth?: string;
  initialHeight?: string;
  initialX?: number | "center";
  initialY?: number | string;
}

// ---------- Window ----------
const Window = memo(
  ({
    children,
    winId,
    initialWidth,
    initialHeight,
    initialX,
    initialY,
  }: WindowProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { getById, apps, close, focus, minimize } = useApplicationStore(
      (s) => s
    );
    const win = getById(winId);

    const {
      state,
      onMouseDownBorder,
      onMouseDownHeader,
      setMouseCursor,
      isFull,
      onFullSizeToggle, // 필요 시 store 최대화 토글에 연결
    } = useWindow({
      ref,
      initialWidth,
      initialHeight,
      initialX,
      initialY,
      minimized: win?.minimized,
    });

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
        minimizeWindow: () => minimize(winId), // 스토어로 바꾸려면 여기서 toggleMinimize(winId)
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
        minimize,
        focus,
        onMouseDownHeader,
      ]
    );

    return (
      <WindowContext.Provider value={ctxValue}>
        <div
          tabIndex={0}
          ref={ref}
          // onClick={() => focus(winId)}
          onMouseMove={!isFull ? setMouseCursor : undefined}
          onMouseDown={
            !isFull
              ? (e) => {
                  focus(winId);
                  onMouseDownBorder(e);
                }
              : () => focus(winId)
          }
          className="window flex flex-col absolute"
          style={{ zIndex }}
        >
          {children}
        </div>
      </WindowContext.Provider>
    );
  }
);

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

export interface MenuItem {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface MenuGroup {
  label: string;
  key: string;
  items: MenuItem[];
}

interface WindowMenuBarProps {
  menus?: MenuGroup[];
}

const WindowMenuBar = ({ menus: customMenus }: WindowMenuBarProps) => {
  const { closeWindow, winId } = useContext(WindowContext);
  const [active, setActive] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Refs for focus management
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const onToggle = (menuKey: string) =>
    setActive((prev) => (prev === menuKey ? null : menuKey));

  useEffect(() => {
    const clickAway = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setActive(null);
    };
    document.addEventListener("click", clickAway);
    return () => {
      document.removeEventListener("click", clickAway);
    };
  }, []);

  // Default menus if none provided
  const defaultMenus: MenuGroup[] = useMemo(
    () => [
      {
        label: "File",
        key: "file",
        items: [{ label: "Close", onClick: closeWindow }],
      },
      {
        label: "Help",
        key: "help",
        items: [
          { label: "Help Topics", disabled: true },
          { label: "About", disabled: true },
        ],
      },
      {
        label: "View",
        key: "view",
        items: [
          { label: "This is Dummy", disabled: true },
          { label: "Sorry", disabled: true },
        ],
      },
    ],
    [closeWindow]
  );

  const menus = customMenus || defaultMenus;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    ) {
      return;
    }

    // Basic hotkey support for standard menus
    // This could be improved to be dynamic based on first letter
    if (e.code === "KeyF") {
      const btn = buttonRefs.current.get("file");
      if (btn) {
        btn.focus();
        setActive("file");
      }
    }
    if (e.code === "KeyH") {
      const btn = buttonRefs.current.get("help");
      if (btn) {
        btn.focus();
        setActive("help");
      }
    }
    if (e.code === "KeyV") {
      const btn = buttonRefs.current.get("view");
      if (btn) {
        btn.focus();
        setActive("view");
      }
    }
  };

  return (
    <div
      ref={menuRef}
      className="WindowMenuBar"
      style={{ zIndex: 1000 }}
      role="menubar"
      tabIndex={-1}
      onMouseDown={() => {
        menuRef.current?.focus();
      }}
      onKeyDown={handleKeyDown}
    >
      {menus.map((group) => (
        <div
          key={group.key}
          className="StandardMenuWrapper MenuBar__section WindowProgram__menu"
        >
          <Button
            onClick={() => onToggle(group.key)}
            onMouseEnter={(e) =>
              active && (e.currentTarget as HTMLButtonElement).focus()
            }
            ref={(el) => {
              if (el) buttonRefs.current.set(group.key, el);
              else buttonRefs.current.delete(group.key);
            }}
            className={active === group.key ? "active" : ""}
            aria-haspopup="menu"
            aria-expanded={active === group.key}
          >
            {/* Simple heuristic for underlining first letter: just render label for now, 
                or manually handle "File" -> "F" underline if we want to be fancy. 
                For now, let's just render the label. 
                If we want to preserve the exact look of "File" with 'F' underlined, 
                we'd need more complex data structure or parsing. 
                I'll check if the label matches standard ones to apply underline. */}
            {group.label === "File" ? (
              <>
                <span style={{ textDecoration: "underline" }}>F</span>ile
              </>
            ) : group.label === "Help" ? (
              <>
                <span style={{ textDecoration: "underline" }}>H</span>elp
              </>
            ) : group.label === "View" ? (
              <>
                <span style={{ textDecoration: "underline" }}>V</span>iew
              </>
            ) : (
              group.label
            )}
          </Button>

          {active === group.key && (
            <div className="StandardMenu">
              <div className="divider divider--group-0-start" />
              {group.items.map((item, idx) => (
                <div key={idx} className="StandardMenuItem">
                  <button
                    className={`StandardMenuItem__button ${
                      item.disabled ? "disabled" : "btn"
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!item.disabled) {
                        item.onClick?.();
                        setActive(null);
                      }
                    }}
                  >
                    <span style={{ textDecoration: "underline" }}>
                      {item.label.charAt(0).toUpperCase()}
                    </span>
                    {item.label.slice(1)}
                  </button>
                </div>
              ))}
              <div className="divider divider--group-0-end" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const WindowAddressBar = () => {
  const {
    back,
    forward,
    up,
    backStack,
    forwardStack,
    fs,
    goBackTo,
    currentId,
    isRoot,
  } = useExplorerContext((s) => s);
  const [isBackOpen, setBackOpen] = useState(false);
  const backRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        isBackOpen &&
        backRef.current &&
        !backRef.current.contains(e.target as Node)
      ) {
        setBackOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [isBackOpen]);

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
      <div
        style={{
          display: "inline-block",
          position: "relative",
          width: "fit-content",
        }}
        ref={backRef}
      >
        <button
          className="toolbar-dropdown-button lightweight forward-dropdown-button "
          style={{
            boxShadow: "none",
            background: "none",
            minWidth: "fit-content",
            padding: "0px",
            height: "100%",
          }}
          disabled={!canBack}
          onClick={() => setBackOpen(!isBackOpen)}
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
        {isBackOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              zIndex: 100,
              backgroundColor: "#c0c0c0",
              border: "2px solid",
              borderColor: "#dfdfdf #000000 #000000 #dfdfdf",
              boxShadow: "2px 2px 5px rgba(0,0,0,0.3)",
            }}
          >
            {backStack
              .slice(-5)
              .reverse()
              .map((id) => {
                const node = fs.byId[id];
                return (
                  <div
                    key={id}
                    style={{
                      padding: "4px 8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      width: "max-content",
                    }}
                    onClick={() => {
                      goBackTo(id);
                      setBackOpen(false);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#000080";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "";
                      e.currentTarget.style.color = "black";
                    }}
                  >
                    {node?.iconUrl && (
                      <img
                        src={node.iconUrl}
                        alt=""
                        style={{ width: "16px", height: "16px" }}
                      />
                    )}
                    <span style={{ fontSize: "12px" }}>{node?.name || id}</span>
                  </div>
                );
              })}
          </div>
        )}
      </div>

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
        onClick={up}
        style={{
          boxShadow: "none",
          background: "none",
          filter: isRoot() ? "url(#disabled-inset-filter)" : undefined,
        }}
        disabled={isRoot()}
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
