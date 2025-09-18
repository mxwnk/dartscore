"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dart } from "../models/dart";
import DartIcon from "@/public/dart.svg";
import Image from "next/image";

export function DartThrow(props: { dart: Dart | undefined }) {
  const [showEmoji, setShowEmoji] = useState(false);
  const previousLabelRef = useRef<string | undefined>(undefined);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const dartLabel = useMemo(
    () => (props.dart ? `${props.dart.ring ?? ""}${props.dart.score}` : "\u00A0"),
    [props.dart]
  );

  useEffect(() => {
    const previous = previousLabelRef.current;
    const isBlank = dartLabel === "\u00A0";
    const hasChangedToValue = previous !== dartLabel && !isBlank;

    previousLabelRef.current = dartLabel;

    if (hasChangedToValue) {
      setShowEmoji(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      requestAnimationFrame(() => {
        setShowEmoji(true);
        timerRef.current = setTimeout(() => {
          setShowEmoji(false);
          timerRef.current = null;
        }, 300);
      });
    } else if (isBlank) {
      setShowEmoji(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [dartLabel]);

  useEffect(() => {
    previousLabelRef.current = dartLabel;
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [dartLabel]);

  return (
    <div className="relative flex items-center justify-center">
      {showEmoji && (
        <span className="absolute inset-0 z-10 flex items-center justify-center text-4xl leading-none select-none pointer-events-none animate-dart-emoji">
          <Image src={DartIcon} className="w-8 h-8" alt="Dart Icon" />
        </span>
      )}
      <h5 className="text-2xl">{showEmoji ? "\u00A0" : dartLabel}</h5>
    </div>
  );
}
