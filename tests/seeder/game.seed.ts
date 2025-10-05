import { Game } from "@/app/domain/game";
import { seedPlayer } from "./player.seed";
import { Checkout } from "@/app/models/checkout";

export const seedDefaultGame = () => startGame({ startpoints: 501, checkout: "Double", playerCount: 2, legs: 3 });

export function startGame(config?: { startpoints?: number; checkout?: Checkout; playerCount?: number; legs?: number }) {
  const game = Game.create({
    startpoints: config?.startpoints,
    checkout: config?.checkout,
    legs: config?.legs,
  });
  const playerCount = config?.playerCount ?? 1;
  for (let i = 0; i < playerCount; i++) {
    const player = seedPlayer({ id: i.toString() });
    game.addPlayer(player);
  }
  game.start();
  game.flush();
  return game;
}