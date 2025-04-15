"use client";

import { Target, Tv } from "lucide-react";
import { ReactElement, useState } from "react";

type GameViewProps = {
  spectator: ReactElement;
  player: ReactElement;
};

export function ViewSelector(props: GameViewProps) {
  const [viewMode, setViewMode] = useState<"Spectator" | "Player">("Player");

  function toggleViewMode() {
    if (viewMode === "Player") {
      setViewMode("Spectator");
    } else {
      setViewMode("Player");
    }
  }

  return (
    <div className="mt-4 px-2 max-w-[1800px] mx-auto">
      {viewMode === "Spectator" && props.spectator}
      {viewMode === "Player" && props.player}
      <button
        onClick={toggleViewMode}
        className="fixed cursor-pointer bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg transition-all"
        aria-label="Open Dialog"
      >
        {viewMode === "Player" && <Tv className="h-6 w-6" />}
        {viewMode === "Spectator" && <Target className="h-6 w-6" />}
      </button>
    </div>
  );
}
