"use client";
import {
  KeyboardEvent as ReactKeyboardEvent,
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "../styles/index.scss";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";
import { launchTarget } from "@lib/utils/launcher";

type StartMenuItem = {
  id: string;
  label: string;
  target: string;
  iconApp: string;
  dividerBefore?: boolean;
};

const START_MENU_ITEMS: StartMenuItem[] = [
  {
    id: "computer",
    label: "Computer",
    target: "computer",
    iconApp: "computer",
  },
  {
    id: "documents",
    label: "Documents",
    target: "document",
    iconApp: "document",
  },
  {
    id: "articles",
    label: "Articles",
    target: "articles",
    iconApp: "articles",
  },
  { id: "about", label: "About Me", target: "about", iconApp: "about" },
  {
    id: "guestbook",
    label: "Guestbook",
    target: "guestbook",
    iconApp: "guestbook",
  },
  { id: "contact", label: "Contact", target: "contact", iconApp: "contact" },
  { id: "notepad", label: "Notepad", target: "notepad", iconApp: "notepad" },
  {
    id: "recycle-bin",
    label: "Recycle Bin",
    target: "recyclebin",
    iconApp: "recycle-bin",
  },
  {
    id: "run",
    label: "Run...",
    target: "run",
    iconApp: "run-dialog",
    dividerBefore: true,
  },
  {
    id: "cmd",
    label: "Command Prompt",
    target: "cmd",
    iconApp: "dos-prompt",
  },
];

const StartBar = () => {
  return (
    <div className="StartBar">
      <StartBarStart />
      <div className="StartBar__quick-launch" style={{ display: "flex" }}>
        <button
          style={{ minWidth: 0, padding: 0, minHeight: 0, margin: "auto" }}
        >
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAnUExURUdwTFOoqf///wAAAMDHyIeIjxEA/6ipUf7/AKoAVwcAqwD///8AAC/f764AAAABdFJOUwBA5thmAAAAZUlEQVQY012O0RKAIAgEQQ4s6/+/N06trH3bnZsBkYV9lw/1ZFDipG7V3EQPDZSEHpGhO7o3MHQfezSGxYFm4vRSh8MZ0osV2BOMR7AuskxnUNrt8yxeV34auIm+yFd9EMrX7ccF27wDshZIPIoAAAAASUVORK5CYII=" />
        </button>
      </div>
      <StartBarApplications />
      <StartBarTime />
    </div>
  );
};

const StartBarStart = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const menuButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { open, apps } = useApplicationStore((s) => s);

  const menuItems = useMemo(
    () =>
      START_MENU_ITEMS.map((item) => ({
        ...item,
        iconUrl: apps[item.iconApp]?.miniIconUrl || apps[item.iconApp]?.iconUrl,
      })),
    [apps],
  );

  useEffect(() => {
    if (!isOpen) return;

    const focusTimer = window.setTimeout(() => {
      menuButtonRefs.current[0]?.focus();
    }, 0);

    const onClickAway = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickAway);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("mousedown", onClickAway);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setIsOpen(false);
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isOpen]);

  const handleSelect = useCallback(
    (target: string) => {
      launchTarget(target, { open });
      setIsOpen(false);
    },
    [open],
  );

  const focusMenuItem = useCallback((index: number) => {
    const items = menuButtonRefs.current.filter(Boolean) as HTMLButtonElement[];
    if (items.length === 0) return;
    const clamped = ((index % items.length) + items.length) % items.length;
    items[clamped]?.focus();
  }, []);

  const handleMenuKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      const items = menuButtonRefs.current.filter(Boolean) as HTMLButtonElement[];
      const currentIndex = items.findIndex((item) => item === target);

      if (event.key === "ArrowDown") {
        event.preventDefault();
        focusMenuItem(currentIndex < 0 ? 0 : currentIndex + 1);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        focusMenuItem(currentIndex < 0 ? items.length - 1 : currentIndex - 1);
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        focusMenuItem(0);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        focusMenuItem(items.length - 1);
        return;
      }
    },
    [focusMenuItem],
  );

  return (
    <div
      ref={containerRef}
      className={`StartBar__start ${isOpen ? "active" : ""}`}
      data-start-menu-root="true"
    >
      <button
        className={`StartButton ${isOpen ? "active" : ""}`}
        aria-label="Start"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            if (!isOpen) setIsOpen(true);
            focusMenuItem(0);
          }
        }}
      />
      <div
        className={`StartMenu ${isOpen ? "active" : ""}`}
        aria-hidden={!isOpen}
        onKeyDown={handleMenuKeyDown}
      >
        {menuItems.map((item, index) => (
          <Fragment key={item.id}>
            {item.dividerBefore && <div className="divider" />}
            <div>
              <button
                className="StartMenu__item"
                ref={(element) => {
                  menuButtonRefs.current[index] = element;
                }}
                onClick={() => handleSelect(item.target)}
                style={{
                  ...(item.iconUrl
                    ? {
                        backgroundImage: `url(${item.iconUrl})`,
                        backgroundRepeat: "no-repeat",
                      }
                    : undefined),
                }}
              >
                {item.label}
              </button>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export const StartBarApplications = () => {
  const { windows, apps } = useApplicationStore((s) => s);

  // 최상단 창 zIndex
  const topZ = windows.length ? Math.max(...windows.map((w) => w.zIndex)) : 0;

  // 작업표시줄에 보일 창만(예: minimized도 보이게 둘지 정책에 따라 필터)
  const taskWindows = windows.map((w) => ({
    ...w,
    // 버튼 라벨/아이콘은 앱 메타에서 가져옴
    label: apps[w.app]?.label ?? w.title ?? w.app,
    icon: apps[w.app]?.miniIconUrl ?? "",
  }));
  // startBar 순서를 별도 관리하고 싶으면 createdAt/order 필드를 windows에 추가해서 정렬
  const { focus, minimize, restore } = useApplicationStore((s) => s);

  return (
    <div className="StartBar__applications">
      {taskWindows.map((w) => (
        <Fragment key={w.id}>
          {w.icon ? (
            <button
              onClick={() => {
                if (w.minimized) {
                  restore(w.id);
                } else if (w.zIndex === topZ) {
                  minimize(w.id);
                } else {
                  focus(w.id);
                }
              }}
              style={{ backgroundImage: `url(${w.icon})` }}
              className={`btn StartBar__icon ${
                w.zIndex === topZ && !w.minimized ? "actived" : ""
              }`}
              title={w.title}
            >
              {w.label}
            </button>
          ) : (
            <button
              onClick={() => {
                if (w.minimized) {
                  restore(w.id);
                } else if (w.zIndex === topZ) {
                  minimize(w.id);
                } else {
                  focus(w.id);
                }
              }}
              className={`btn StartBar__icon ${
                w.zIndex === topZ && !w.minimized ? "actived" : ""
              }`}
              style={{ paddingLeft: "10px" }}
              title={w.title}
            >
              {w.label}
            </button>
          )}
        </Fragment>
      ))}
    </div>
  );
};

const StartBarTime = memo(() => {
  const timeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () => {
      if (timeRef.current) {
        timeRef.current.textContent = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    };

    tick();
    const timerId = window.setInterval(tick, 1000);
    return () => window.clearInterval(timerId);
  }, []);

  return (
    <div className="StartBar__notifications">
      {/* <button className="btn Notifier StartBar__notifications__notifier" /> */}
      <div className="StartBar__notifications__time" ref={timeRef}></div>
    </div>
  );
});

export { StartBar };
