"use client";
import { Fragment, ReactNode, createContext, useRef } from "react";
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
        <div className="StartBar__quick-launch"></div>
        <StartBarApplications></StartBarApplications>
        <div className="StartBar__notifications">
          <button className="btn Notifier StartBar__notifications__notifier" />
          <div className="StartBar__notifications__time"></div>
        </div>
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
      .getApplications()
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

export { StartBar };
