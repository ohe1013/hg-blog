"use client";
import { ReactNode, createContext, useRef } from "react";
import { useWindow } from "../../window/hooks/useWindow";
import "../styles/TaskBar.scss";

interface Props {
  children: ReactNode;
}

const TaskBarContext = createContext<{}>({});

const TaskBar = () => {
  return (
    <TaskBarContext.Provider value={{}}>
      <div className="TaskBar">
        <div className="TaskBar__start" />
        <div className="TaskBar__quick-launch"></div>
        <div className="TaskBar__programs"></div>
        <div className="TaskBar__notifications">
          <button className="btn Notifier TaskBar__notifications__notifier" />
          <div className="TaskBar__notifications__time"></div>
        </div>
      </div>
    </TaskBarContext.Provider>
  );
};

export { TaskBar };
