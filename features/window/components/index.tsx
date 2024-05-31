"use client";
import { ReactNode, createContext, useContext, useState } from "react";
import Draggable from "react-draggable";

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
};
const WindowContext = createContext<{
  context: typeof windowDefaultContext;
  setContext: (data: Partial<typeof windowDefaultContext>) => void;
}>({ context: windowDefaultContext, setContext: () => {} });

const Window = ({ children }: Props) => {
  const [windowContext, setWindowContext] =
    useState<typeof windowDefaultContext>(windowDefaultContext);
  const setData = (data: Partial<typeof windowDefaultContext>) => {
    setWindowContext((prev) => {
      return { ...prev, ...data };
    });
  };

  return (
    <WindowContext.Provider value={{ context: windowContext, setContext: setData }}>
      <Draggable handle=".title-bar">
        <div
          style={{ position: "absolute", ...windowContext.size, ...windowContext.position }}
          className="window"
        >
          {children}
        </div>
      </Draggable>
    </WindowContext.Provider>
  );
};

interface HeaderProps {
  title: string;
  type: keyof typeof headerType;
}
const headerType = {
  resize: {
    normal: ["Minimize", "Maximize", "Close"],
    full: ["Minimize", "Restore", "Close"],
  },
  question: {
    normal: ["Minimize", "Close"],
  },
};
const Header = (props: HeaderProps) => {
  type headerType = typeof headerType;
  const [detailType, setDetailType] = useState<keyof headerType[keyof headerType]>("normal");
  const buttonList = headerType[props.type][detailType];

  <div className="title-bar">
    <div className="title-bar-text">{props.title}</div>
    <div className="title-bar-controls">
      {buttonList.map((type) => {
        return <button aria-label={type}></button>;
      })}
    </div>
  </div>;
};
const WindowResizeHeader = (props: HeaderProps) => {
  const [isFull, setIsFull] = useState<boolean>(false);
  const { context, setContext } = useContext(WindowContext);
  const fullSizeHanlder = () => {
    if (isFull) {
      setIsFull(false);
      const prevSize = context.prevSize;
      setContext({
        size: { width: prevSize.width, height: prevSize.height },
      });
    } else {
      setIsFull(true);
      const currentSize = context.size;
      setContext({
        prevSize: { width: currentSize.width, height: currentSize.height },
        size: { width: "100%", height: "100%" },
      });
    }
  };

  return (
    <div className="title-bar" onDoubleClick={fullSizeHanlder}>
      <div className="title-bar-text">{props.title}</div>
      <div className="title-bar-controls">
        <button aria-label="Minimize" />
        <button aria-label={isFull ? "Restore" : "Maximize"} onClick={fullSizeHanlder} />
        <button aria-label="Close" />
      </div>
    </div>
  );
};
const WindowBody = (props: { children: ReactNode }) => {
  const { context } = useContext(WindowContext);
  return <div style={{ height: context.size.height, overflowY: "scroll" }}>{props.children}</div>;
};

export { Window, WindowResizeHeader, WindowBody };
