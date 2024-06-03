"use client";
import { ReactNode, createContext, useContext, useRef } from "react";
import { State, useWindow } from "../hooks/useWindow";

interface Props {
  children: ReactNode;
}

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
  const { state, onMouseDown, borderMouseMove, isFull, onFullSizeToggle } = useWindow({ ref });

  return (
    <WindowContext.Provider value={{ context: state, isFull, onFullSizeToggle }}>
      <div
        style={{
          position: "absolute",
        }}
        ref={ref}
        onMouseMove={borderMouseMove}
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
        <button aria-label={isFull ? "Restore" : "Maximize"} onClick={onFullSizeToggle} />
        <button aria-label="Close" />
      </div>
    </div>
  );
};
const WindowBody = (props: { children: ReactNode }) => {
  const { context } = useContext(WindowContext);
  const height = Number(context?.size.height.slice(0, -2)) - 50 + "px";
  return <div style={{ height: height, overflowY: "scroll" }}>{props.children}</div>;
};

const WindowStatus = () => {
  return (
    <div className="status-bar">
      <p className="status-bar-field">Press F1 for help</p>
      <p className="status-bar-field">Slide 1</p>
      <p className="status-bar-field">CPU Usage: 14%</p>
    </div>
  );
};

export { Window, WindowResizeHeader, WindowBody, WindowStatus };
