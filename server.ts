import { createServer, Server } from "http";
import { parse } from "url";
import next from "next";
import { createWebsocketServer } from "./server/websocket";
import { initGameBroker } from "./server/game-broker";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";

async function main() {
  const server = await createNextServer({ dev });
  const wss = createWebsocketServer({ server, dev });
  initGameBroker(wss);
  server.listen(port);
}

async function createNextServer({ dev }: { dev: boolean }): Promise<Server> {
  const nextApp = next({ dev, turbopack: true });
  const handle = nextApp.getRequestHandler();
  await nextApp.prepare();
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });
  return server;
}

main().then(() => {
  console.log(
    `Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV}`,
  );
});
