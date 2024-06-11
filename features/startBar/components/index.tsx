"use client";
import { ReactNode, createContext, useRef } from "react";
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

  return (
    <div className="StartBar__applications">
      {applicationStore.stackList.map((stack) => (
        <button className="btn ButtonProgram">{stack}</button>
      ))}
    </div>
  );
};

export { StartBar };
