"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dart } from "../models/dart";

export function DartThrow(props: { dart: Dart | undefined }) {
  const dartLabel = useMemo(
    () => (props.dart ? `${props.dart.ring ?? ""}${props.dart.score}` : "\u00A0"),
    [props.dart?.ring, props.dart?.score]
  );

  const [showEmoji, setShowEmoji] = useState(false);
  const previousLabelRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const previous = previousLabelRef.current;
    const isBlank = dartLabel === "\u00A0";
    const hasChangedToValue = previous !== dartLabel && !isBlank;
    if (hasChangedToValue) {
      setShowEmoji(true);
      const timer = setTimeout(() => setShowEmoji(false), 700);
      previousLabelRef.current = dartLabel;
      return () => clearTimeout(timer);
    }
    previousLabelRef.current = dartLabel;
  }, [dartLabel]);

  useEffect(() => {
    previousLabelRef.current = dartLabel;
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      {showEmoji && (
        <span className="absolute inset-0 z-10 flex items-center justify-center text-4xl leading-none select-none pointer-events-none animate-dart-emoji">
          🎯
        </span>
      )}
      <h5 className="text-2xl">{dartLabel}</h5>
    </div>
  );
}
