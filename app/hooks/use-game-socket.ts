import { useEffect } from "react";
import { useWebSocket } from "./use-websocket";
import { isDev } from "@/lib/env";
import { GameUpdate } from "../models/messages";

export function useGameSocket({
  onVersionUpdate,
  gameId,
}: {
  onVersionUpdate: (version: number) => void;
  gameId: string;
}) {
  const socket = useWebSocket(getBaseUrl());
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "GameUpdate") {
        const gameUpdate = data as GameUpdate;
        onVersionUpdate(gameUpdate.version);
      }
    };

    const handleError = (event: Event) => {
      console.error("❌ WebSocket Error:", event);
    };

    const handleClose = (event: CloseEvent) => {
      console.warn("🔌 WebSocket Closed:", event);
    };

    const joinGame = () => {
      console.log("WebSocket open");
      socket.send(JSON.stringify({ type: "JoinGame", gameId }));
    };

    socket.addEventListener("message", handleMessage);
    socket.addEventListener("error", handleError);
    socket.addEventListener("close", handleClose);
    socket.addEventListener("open", joinGame);

    return () => {
      socket.removeEventListener("message", handleMessage);
      socket.removeEventListener("error", handleError);
      socket.removeEventListener("close", handleClose);
    };
  }, [socket, onVersionUpdate, gameId]);
}

const getBaseUrl = () => {
  if (isDev || !typeof window) {
    return `ws://localhost:3001/ws`;
  }
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${window.location.host}/ws`;
};
