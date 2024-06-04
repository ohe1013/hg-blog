"use client";
import { ReactNode, createContext, useContext, useRef } from "react";

interface Props {
  children: ReactNode;
}

const TaskBarContext = createContext<{}>({});

const TaskBar = ({ children }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { state, onMouseDown, borderMouseMove, isFull, onFullSizeToggle } =
    useWindow({ ref });

  return (
    <TaskBarContext.Provider
      value={{ context: state, isFull, onFullSizeToggle }}
    >
      <div
        style={{
          position: "fixed",
        }}
        ref={ref}
        onMouseMove={borderMouseMove}
        onMouseDown={!isFull ? onMouseDown : (e) => {}}
        className="window"
      >
        {children}
      </div>
    </TaskBarContext.Provider>
  );
};
