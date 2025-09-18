"use client";
import React, { JSX, useEffect, useRef } from "react";

type PulseProps<T> = {
  value: T;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
};

export function Pulse<T>(props: PulseProps<T>) {
  const { value, as = "span", className } = props;
  const elementRef = useRef<HTMLElement | null>(null);
  const previousValueRef = useRef<T>(value);

  const equals = ((a: T, b: T) => a === b);

  useEffect(() => {
    if (equals(previousValueRef.current, value)) {
      return;
    }
    const el = elementRef.current;
    if (el) {
      el.classList.remove("animate-score-bump");
      // Force reflow to restart the animation
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      el.offsetWidth;
      el.classList.add("animate-score-bump");
    }
    previousValueRef.current = value;
  }, [value]);

  return React.createElement(
    as,
    { ref: elementRef as any, className },
    value as any
  );
}


