"use client";

import { useGameSocket } from "@/app/hooks/use-game-socket";
import React, { PropsWithChildren } from "react";
import { refresh } from "./refresh";

type GameSynchronizerProps = PropsWithChildren & {
  gameId: string;
  version: number;
};

export const GameSynchronizer = ({
  children,
  gameId,
  version,
}: GameSynchronizerProps) => {
  useGameSocket({
    gameId,
    onVersionUpdate: (newVersion) => {
      if (version === newVersion) {
        return;
      }
      refresh(gameId);
    },
  });
  return <>{children}</>;
};
