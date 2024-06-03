"use client";
import { ReactNode, createContext, useContext, useRef, useState } from "react";
import { State, useWindow } from "../hooks/useWindow";

interface Props {
  children: ReactNode;
}

const defaultSize = {
  width: "500px",
  height: "500px",
};
const defaultPosition = {
  left: "200px",
  top: "200px",
};

const windowDefaultContext = {
  size: defaultSize,
  position: defaultPosition,
  prevSize: defaultSize,
  prevPosition: defaultPosition,
  isFull: false,
  onFullSizeToggle: () => {},
};
const WindowContext = createContext<{
  context?: State;
  isFull: boolean;
  onFullSizeToggle: any;
}>({
  isFull: false,
  onFullSizeToggle: () => {},
});

const Window = ({ children }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { state, onMouseDown, isFull, onFullSizeToggle } = useWindow({ ref });

  return (
    <WindowContext.Provider
      value={{ context: state, isFull, onFullSizeToggle }}
    >
      <div
        style={{
          position: "absolute",
        }}
        ref={ref}
        onMouseDown={!isFull ? onMouseDown : (e) => {}}
        className="window"
      >
        {children}
      </div>
    </WindowContext.Provider>
  );
};

interface HeaderProps {
  title: string;
}
const WindowResizeHeader = (props: HeaderProps) => {
  const { isFull, onFullSizeToggle } = useContext(WindowContext);

  return (
    <div className="title-bar" onDoubleClick={onFullSizeToggle}>
      <div className="title-bar-text">{props.title}</div>
      <div className="title-bar-controls">
        <button aria-label="Minimize" />
        <button
          aria-label={isFull ? "Restore" : "Maximize"}
          onClick={onFullSizeToggle}
        />
        <button aria-label="Close" />
      </div>
    </div>
  );
};
const WindowBody = (props: { children: ReactNode }) => {
  const { context } = useContext(WindowContext);
  return (
    <div style={{ height: context?.size.height, overflowY: "scroll" }}>
      {props.children}
    </div>
  );
};

export { Window, WindowResizeHeader, WindowBody };
