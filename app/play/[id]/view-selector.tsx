"use client";

import { Target, Tv } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactElement, useCallback } from "react";

export type ViewMode = "spectator" | "play";

type GameViewProps = {
  gameId: string;
  spectator: ReactElement;
  play: ReactElement;
};

export function ViewSelector(props: GameViewProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const viewMode = searchParams.get("view") as ViewMode;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  function toggleViewMode() {
    const next = viewMode === "play" ? "spectator" : "play"
    const url = pathname + "?" + createQueryString("view", next);
    router.replace(url);
  }

  return (
    <div className="mt-4 px-2 max-w-[1800px] mx-auto">
      {viewMode === "spectator" && props.spectator}
      {viewMode === "play" && props.play}
      <button
        onClick={() => toggleViewMode()}
        className="fixed cursor-pointer bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg transition-all"
      >
        {viewMode === "play" && <Tv className="h-6 w-6" />}
        {viewMode === "spectator" && <Target className="h-6 w-6" />}
      </button>
    </div>
  );
}
