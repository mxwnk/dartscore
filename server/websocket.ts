import { WebSocketServer } from "ws";
import { Server } from "http";

const globalSocket = global as unknown as { websocketServer: WebSocketServer };

type CreateServer = {
  server: Server;
  dev: boolean;
};

export function createWebsocketServer({
  server,
  dev,
}: CreateServer): WebSocketServer {
  if (globalSocket.websocketServer) {
    throw new Error("Create Websocket Server should only be called once!");
  }
  const config = dev ? { path: "/ws", port: 3001 } : { server };
  const wss = new WebSocketServer(config);
  globalSocket.websocketServer = wss;
  wss.on("connection", (client) => {
    client.on("error", console.error);
  });
  return wss;
}

export const websocketServer =
  globalSocket.websocketServer ??
  new Error("WebSocketServer is not initialized!");
