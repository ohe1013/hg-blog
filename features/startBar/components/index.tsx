"use client";
import {
  Fragment,
  ReactNode,
  createContext,
  memo,
  useEffect,
  useRef,
} from "react";
import "../styles/index.scss";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";

interface Props {
  children: ReactNode;
}

const StartBarContext = createContext<{}>({});

const StartBar = () => {
  return (
    <StartBarContext.Provider value={{}}>
      <div className="StartBar">
        <StartBarStart></StartBarStart>
        <div className="StartBar__quick-launch" style={{display:'flex'}}>
          <button style={{ minWidth: 0, padding: 0, minHeight: 0,margin:'auto' }}>
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAnUExURUdwTFOoqf///wAAAMDHyIeIjxEA/6ipUf7/AKoAVwcAqwD///8AAC/f764AAAABdFJOUwBA5thmAAAAZUlEQVQY012O0RKAIAgEQQ4s6/+/N06trH3bnZsBkYV9lw/1ZFDipG7V3EQPDZSEHpGhO7o3MHQfezSGxYFm4vRSh8MZ0osV2BOMR7AuskxnUNrt8yxeV34auIm+yFd9EMrX7ccF27wDshZIPIoAAAAASUVORK5CYII=" />
          </button>
        </div>
        <StartBarApplications></StartBarApplications>
        <StartBarTime />
      </div>
    </StartBarContext.Provider>
  );
};

const StartBarStart = () => {
  return (
    <div className="StartBar__start">
      <button className="StartButton"></button>
      <div></div>
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
        </Fragment>
      ))}
    </div>
  );
};

const StartBarTime = memo(() => {
  const timeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInterval(() => {
      if (timeRef.current) {
        timeRef.current.textContent = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    }, 1000);
  }, []);

  return (
    <div className="StartBar__notifications">
      {/* <button className="btn Notifier StartBar__notifications__notifier" /> */}
      <div className="StartBar__notifications__time" ref={timeRef}></div>
    </div>
  );
});

export { StartBar };
