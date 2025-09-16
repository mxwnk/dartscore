import { describe, expect, it } from "vitest";
import { Game } from "@/app/domain/game";
import { seedPlayer } from "../seeder/player.seed";
import { DartThrown, PlayerAdded, TurnStarted } from "@/app/domain/events";
import { Checkout } from "@/app/models/checkout";
import { randomDart } from "../seeder/dart.seed";

describe("Game", () => {
  it("🎮 should allow to create a new game", async () => {
    const game = Game.create();

    const events = game.flush();
    expect(events.length).toBe(1);
    expect((events[0].type = "GameCreated"));
  });

  it("🙋‍♀️ should allow to add player", async () => {
    const game = Game.create();
    const player = seedPlayer();

    game.addPlayer(player);

    const events = game.flush();
    const playerAdded = events[1] as PlayerAdded;
    expect(playerAdded.type).toBe("PlayerAdded");
    expect(playerAdded.payload.id).toBe(player.id);
    expect(playerAdded.payload.name).toBe(player.name);
  });

  it("🙋‍♂️ should allow to add multiple players", async () => {
    const game = Game.create();
    const first = seedPlayer();
    const second = seedPlayer();

    game.addPlayer(first);
    game.addPlayer(second);

    const events = game.flush();
    const playerAddedEvents = events.slice(1, 3);
    expect(playerAddedEvents.length).toBe(2);
    playerAddedEvents.every((e) => expect(e.type).toBe("PlayerAdded"));
  });

  describe("Darts", () => {
    it("🎯 should track thrown darts", async () => {
      const game = startGame();

      game.throwDart({ score: 1, ring: "D" });

      const events = game.flush();
      expect(events.length).toBe(1);
      var dartThrownEvent = events[0] as DartThrown;
      expect(dartThrownEvent.type).toBe("DartThrown");
      expect(dartThrownEvent.payload.score).toBe(1);
      expect(dartThrownEvent.payload.ring).toBe("D");
    });

    it("✅ should mark throw as legal if missing score > 0", async () => {
      const game = startGame({ startpoints: 2 });

      game.throwDart({ score: 1 });

      const events = game.flush();
      expect(events.length).toBe(1);
      var dartThrownEvent = events[0] as DartThrown;
      expect(dartThrownEvent.type).toBe("DartThrown");
      expect(dartThrownEvent.payload.overthrown).toBe(false);
    });

    it("✅ should mark throw as legal if double out checked ", async () => {
      const game = startGame({ startpoints: 2, checkout: "Double" });

      game.throwDart({ score: 1, ring: "D" });

      const events = game.flush();
      var dartThrownEvent = events[0] as DartThrown;
      expect(dartThrownEvent.payload.overthrown).toBe(false);
    });

    it("❌ should mark throw as overthrown if score < 0", async () => {
      const game = startGame({ startpoints: 2 });

      game.start();
      game.throwDart({ score: 3, ring: "D" });

      const events = game.flush();
      expect(events.length).toBe(4);
      var dartThrownEvent = events.at(2) as DartThrown;
      expect(dartThrownEvent.type).toBe("DartThrown");
      expect(dartThrownEvent.payload.overthrown).toBe(true);
    });

    it("❌ should mark throw as overthrown if double checkout busted", async () => {
      const game = startGame({ startpoints: 2, checkout: "Double" });

      game.start();
      game.throwDart({ score: 1, ring: undefined });

      const events = game.flush();
      var dartThrownEvent = events[2] as DartThrown;
      expect(dartThrownEvent.payload.overthrown).toBe(true);
    });

    it("❌ should mark throw as overthrown if double out missed", async () => {
      const game = startGame({ startpoints: 2, checkout: "Double" });

      game.throwDart({ score: 2, ring: undefined });

      const events = game.flush();
      var dartThrownEvent = events[0] as DartThrown;
      expect(dartThrownEvent.payload.overthrown).toBe(true);
    });

    it("↻ should change turn after 3 darts", async () => {
      const game = seedDefaultGame();

      game.throwDart(randomDart());
      game.throwDart(randomDart());
      game.throwDart(randomDart());
      const events = game.flush();

      const turnStarted = events[events.length - 1] as TurnStarted;

      expect(turnStarted.type).toBe("TurnStarted");
    });
  });
});

const seedDefaultGame = () => startGame({ startpoints: 501, checkout: "Double", playerCount: 2 });

function startGame(config?: { startpoints?: number; checkout?: Checkout; playerCount?: number }) {
  const game = Game.create({
    startpoints: config?.startpoints,
    checkout: config?.checkout,
  });
  const playerCount = config?.playerCount ?? 1;
  for (let i = 0; i < playerCount; i++) {
    const player = seedPlayer();
    game.addPlayer(player);
  }
  game.start();
  game.flush();
  return game;
}