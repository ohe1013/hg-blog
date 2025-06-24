"use client";
import {
  Fragment,
  ReactNode,
  createContext,
  memo,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { useWindow } from "../../window/hooks/useWindow";
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
        <div className="StartBar__quick-launch">
          <button style={{ minWidth: 0, padding: 0, minHeight: 0 }}>
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

const StartBarApplications = () => {
  const applicationStore = useApplicationStore((state) => state);
  const maxZIndex = Math.max(
    ...Object.values(applicationStore.application).map((item) => item.zIndex)
  );
  const applicationList = (
    applicationStore
      .getApplicationKeys()
      .filter(
        (key) => applicationStore.application[key].useApplication === true
      )
      .map((key) => {
        const application = applicationStore.application[key];
        return [
          application.startBarIndex,
          <Fragment key={application.label}>
            <button
              onClick={() => applicationStore.touchUsedApplication(key)}
              style={{ backgroundImage: `url(${application?.miniIconUrl})` }}
              className={
                "btn StartBar__icon " +
                (application.zIndex === maxZIndex ? "actived" : "")
              }
            >
              {application?.label}
            </button>
          </Fragment>,
        ];
      })
      .slice() as [number, JSX.Element][]
  ).sort((a, b) => a[0] - b[0]);

  return (
    <div className="StartBar__applications">
      {applicationList.map((item) => item[1])}
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
