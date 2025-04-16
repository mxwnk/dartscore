import { GameUpdate } from "@/app/models/messages";
import { WebSocketServer } from "ws";
import { WebSocket } from "ws";

const globalBroker = global as unknown as { gameBroker: GameBroker };

export function initGameBroker(websocketServer: WebSocketServer) {
  if (globalBroker.gameBroker) {
    throw new Error("Init GameBroker should only be called once!");
  }
  globalBroker.gameBroker = new GameBroker(websocketServer);
}

class GameBroker {
  private gameToSockets = new Map<string, WebSocket[]>();

  constructor(private websocketServer: WebSocketServer) {
    this.init();
  }

  public broadcastUpdate(gameId: string, version: number) {
    const sockets = this.gameToSockets.get(gameId) ?? [];
    for (const socket of sockets) {
      if (!socket.OPEN) {
        return;
      }
      const update: GameUpdate = { type: "GameUpdate", gameId, version };
      socket.send(JSON.stringify(update));
    }
  }

  private join(gameId: string, socket: WebSocket): void {
    const sockets = this.gameToSockets.get(gameId);
    if (sockets) {
      sockets.push(socket);
    } else {
      this.gameToSockets.set(gameId, [socket]);
    }
  }

  private leave(socket: WebSocket) {
    const gameKeys = this.gameToSockets.keys();
    for (const key of gameKeys) {
      const sockets = this.gameToSockets.get(key)!;
      const updated = sockets.filter((s) => s === socket);
      if (updated.length === 0) {
        this.gameToSockets.delete(key);
      } else {
        this.gameToSockets.set(key, updated);
      }
    }
  }

  private init() {
    this.websocketServer.addListener("connection", (socket) => {
      socket.on("message", (msg) => {
        const data = JSON.parse(msg.toString("utf8"));
        if (data.type === "JoinGame") {
          this.join(data.gameId, socket);
        }
      });

      socket.on("close", () => {
        this.leave(socket);
      });
    });
  }
}

export const gameBroker = globalBroker.gameBroker;
