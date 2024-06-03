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
}

export function useWindow({ ref }: UseDragProps): UseDragProvided {
  const [state, setState] = useState<State>({
    dragStart: PointZero,
    translation: PointZero,
    lastTranslation: PointZero,
    size: DefaultSize,
    lastSize: DefaultSize,
  });

  const [isFull, setIsFull] = useState<boolean>(false);

  const onMouseMove = useCallback((e: MouseEvent) => {
    setState((prev) => ({
      ...prev,
      translation: {
        x: prev.lastTranslation.x + e.clientX - prev.dragStart.x,
        y: prev.lastTranslation.y + e.clientY - prev.dragStart.y,
      },
    }));
  }, []);

  const onMouseUp = useCallback(() => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    setState((prev) => ({
      ...prev,
      lastTranslation: prev.translation,
    }));
  }, [onMouseMove]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
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
    console.log(isFull);
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
    if (ref.current) {
      ref.current.style.transform = `translate(${state.translation.x}px, ${state.translation.y}px)`;
    }
  }, [ref, state.translation.x, state.translation.y]);
  useEffect(() => {
    if (ref.current) {
      console.log(ref.current);
      ref.current.style.width = state.size.width;
      ref.current.style.height = state.size.height;
    }
  }, [ref, state.size.width, state.size.height]);

  return {
    state,
    onMouseDown,
    onFullSizeToggle,
    isFull,
  };
}
