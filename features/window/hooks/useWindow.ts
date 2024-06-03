import React, { useCallback, useEffect, useState } from "react";

interface UseDragProps {
  /**
   * ref to the element that would be moved
   */
  ref: React.RefObject<HTMLElement>;
}

interface UseDragProvided {
  /**
   * Attach as a onMouseDown handler to the element that would be dragged
   */
  state: State;
  onMouseDown: (e: React.MouseEvent<HTMLElement>) => void;
  onFullSizeToggle: () => void;
  borderMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  isFull: boolean;
}

type Point = {
  x: number;
  y: number;
};

type Size = {
  width: string;
  height: string;
};

const PointZero: Point = {
  x: 0,
  y: 0,
};

const DefaultSize: Size = {
  width: "500px",
  height: "500px",
};

export interface State {
  dragStart: Point;
  translation: Point;
  lastTranslation: Point;
  size: Size;
  lastSize: Size;
  resizeDirection: string | null;
}

export function useWindow({ ref }: UseDragProps): UseDragProvided {
  const [state, setState] = useState<State>({
    dragStart: PointZero,
    translation: PointZero,
    lastTranslation: PointZero,
    size: DefaultSize,
    lastSize: DefaultSize,
    resizeDirection: null,
  });

  const [isFull, setIsFull] = useState<boolean>(false);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const { resizeDirection } = state;
      if (resizeDirection) {
        switch (resizeDirection) {
          case "n":
            setState((prev) => {
              return {
                ...prev,
                size: {
                  ...prev.size,
                  height:
                    Number(prev.lastSize.height.slice(0, -2)) -
                    (e.clientY - prev.dragStart.y) +
                    "px",
                },
                translation: {
                  x: prev.translation.x,
                  y: prev.lastTranslation.y + e.clientY - prev.dragStart.y,
                },
              };
            });
            break;
          case "s":
            setState((prev) => {
              return {
                ...prev,
                size: {
                  ...prev.size,
                  height:
                    Number(prev.lastSize.width.slice(0, -2)) +
                    (e.clientY - prev.dragStart.y) +
                    "px",
                },
              };
            });
            break;
          case "e":
            setState((prev) => {
              return {
                ...prev,
                size: {
                  ...prev.size,
                  width:
                    Number(prev.lastSize.width.slice(0, -2)) +
                    (e.clientX - prev.dragStart.x) +
                    "px",
                },
              };
            });
            break;
          case "w":
            setState((prev) => {
              return {
                ...prev,
                size: {
                  ...prev.size,
                  width:
                    Number(prev.lastSize.width.slice(0, -2)) -
                    (e.clientX - prev.dragStart.x) +
                    "px",
                },
                translation: {
                  x: prev.lastTranslation.x + e.clientX - prev.dragStart.x,
                  y: prev.translation.y,
                },
              };
            });
            break;
          case "nw":
            setState((prev) => {
              return {
                ...prev,
                size: {
                  ...prev.size,
                  width:
                    Number(prev.lastSize.width.slice(0, -2)) -
                    (e.clientX - prev.dragStart.x) +
                    "px",
                  height:
                    Number(prev.lastSize.width.slice(0, -2)) -
                    (e.clientY - prev.dragStart.y) +
                    "px",
                },
                translation: {
                  x: prev.lastTranslation.x + e.clientX - prev.dragStart.x,
                  y: prev.lastTranslation.y + e.clientY - prev.dragStart.y,
                },
              };
            });
            break;
          case "ne":
            setState((prev) => {
              return {
                ...prev,
                size: {
                  ...prev.size,
                  width:
                    Number(prev.lastSize.width.slice(0, -2)) +
                    (e.clientX - prev.dragStart.x) +
                    "px",
                  height:
                    Number(prev.lastSize.width.slice(0, -2)) -
                    (e.clientY - prev.dragStart.y) +
                    "px",
                },
                translation: {
                  x: prev.lastTranslation.x + e.clientX - prev.dragStart.x,
                  y: prev.lastTranslation.y + e.clientY - prev.dragStart.y,
                },
              };
            });
            break;
          case "sw":
            setState((prev) => {
              return {
                ...prev,
                size: {
                  ...prev.size,
                  width:
                    Number(prev.lastSize.width.slice(0, -2)) -
                    (e.clientX - prev.dragStart.x) +
                    "px",
                  height:
                    Number(prev.lastSize.width.slice(0, -2)) +
                    (e.clientY - prev.dragStart.y) +
                    "px",
                },
                translation: {
                  x: prev.lastTranslation.x + e.clientX - prev.dragStart.x,
                  y: prev.lastTranslation.y + e.clientY - prev.dragStart.y,
                },
              };
            });
            break;
          case "se":
            setState((prev) => {
              return {
                ...prev,
                size: {
                  ...prev.size,
                  width:
                    Number(prev.lastSize.width.slice(0, -2)) +
                    (e.clientX - prev.dragStart.x) +
                    "px",
                  height:
                    Number(prev.lastSize.width.slice(0, -2)) +
                    (e.clientY - prev.dragStart.y) +
                    "px",
                },
              };
            });
            break;
        }
      } else {
        setState((prev) => ({
          ...prev,
          translation: {
            x: prev.lastTranslation.x + e.clientX - prev.dragStart.x,
            y: prev.lastTranslation.y + e.clientY - prev.dragStart.y,
          },
        }));
      }
    },
    [state.resizeDirection]
  );

  const onMouseUp = useCallback(() => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    setState((prev) => ({
      ...prev,
      lastTranslation: prev.translation,
      lastSize: prev.size,
    }));
  }, [onMouseMove]);

  const borderMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    let resizeDirection = "";
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (y < 10 && y > -10) resizeDirection = "n" + resizeDirection;
    if (y < rect.height + 10 && y > rect.height - 10) resizeDirection = "s" + resizeDirection;
    if (x < 10 && x > -10) resizeDirection = resizeDirection + "w";
    if (x < rect.width + 10 && x > rect.width - 10) resizeDirection = resizeDirection + "e";

    setState((prev) => ({
      ...prev,
      resizeDirection: resizeDirection === "" ? null : resizeDirection,
    }));
  }, []);

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      setState((prev) => ({
        ...prev,
        dragStart: {
          x: e.clientX,
          y: e.clientY,
        },
      }));
    },
    [onMouseMove, onMouseUp]
  );

  const onFullSizeToggle = () => {
    if (isFull) {
      setIsFull(false);
      setState((prev) => ({
        ...prev,
        size: {
          width: prev.lastSize.width,
          height: prev.lastSize.height,
        },
        translation: {
          x: prev.lastTranslation.x,
          y: prev.lastTranslation.y,
        },
      }));
    } else {
      setIsFull(true);
      setState((prev) => ({
        ...prev,
        size: {
          width: "100%",
          height: "100%",
        },
        lastSize: {
          width: prev.size.width,
          height: prev.size.height,
        },
        translation: {
          x: 0,
          y: 0,
        },
        lastTranslation: {
          x: prev.lastTranslation.x,
          y: prev.lastTranslation.y,
        },
      }));
    }
  };
  useEffect(() => {
    if (state.resizeDirection === null) {
      ref.current!.style.cursor = "auto";
    } else {
      ref.current!.style.cursor = state.resizeDirection + "-resize";
    }
  }, [state.resizeDirection]);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.transform = `translate(${state.translation.x}px, ${state.translation.y}px)`;
    }
  }, [ref, state.translation.x, state.translation.y]);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.width = state.size.width;
      ref.current.style.height = state.size.height;
    }
  }, [ref, state.size.width, state.size.height]);

  return {
    state,
    onMouseDown,
    onFullSizeToggle,
    borderMouseMove,
    isFull,
  };
}
