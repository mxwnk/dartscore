import { describe, expect, it } from "vitest";
import { Game } from "@/app/domain/game";
import { seedPlayer } from "../seeder/player.seed";
import { DartThrown, GameOver, LegStarted, LegWon, PlayerAdded, TurnStarted } from "@/app/domain/events";
import { randomDart } from "../seeder/dart.seed";
import { seedDefaultGame, startGame } from "../seeder/game.seed";

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

  it("🙋‍♂️ should prevent adding player after game started", async () => {
    const game = startGame();

    const action = () => game.addPlayer(seedPlayer());

    expect(action).toThrow("Game already started");
  });

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
    const dartThrownEvent = events.find((e) => e.type === "DartThrown") as DartThrown;
    expect(dartThrownEvent.payload.overthrown).toBe(true);
  });

  it("❌ should mark throw as overthrown if double checkout busted", async () => {
    const game = startGame({ startpoints: 2, checkout: "Double" });

    game.start();
    game.throwDart({ score: 1, ring: undefined });

    const events = game.flush();
    const dartThrownEvent = events.find((e) => e.type === "DartThrown") as DartThrown;
    expect(dartThrownEvent.payload.overthrown).toBe(true);
  });

  it("❌ should mark throw as overthrown if double out missed", async () => {
    const game = startGame({ startpoints: 2, checkout: "Double" });

    game.throwDart({ score: 2, ring: undefined });

    const events = game.flush();
    const dartThrownEvent = events.find((e) => e.type === "DartThrown") as DartThrown;
    expect(dartThrownEvent.payload.overthrown).toBe(true);
  });

  it("⏩ should skip player if they have won", async () => {
    const game = startGame({ startpoints: 2, checkout: "Double", playerCount: 2 });

    game.throwDart({ score: 1, ring: "D" });
    game.throwDart({ score: 20 });
    const events = game.flush();

    const turnStarted = events.find((e) => e.type === "TurnStarted") as TurnStarted;
    expect(turnStarted.type).toBe("TurnStarted");
    expect(turnStarted.payload.playerId).toBe("1");
  });

  it("🦵 should mark leg as won", async () => {
    const game = startGame({ startpoints: 2, checkout: "Double", playerCount: 2 });

    game.throwDart({ score: 1, ring: "D" });
    const events = game.flush();

    const legWon = events.find((e) => e.type === "LegWon") as LegWon;
    expect(legWon.type).toBe("LegWon");
    expect(legWon.payload.winner.playerId).toBe("0");
  });
  
  it("🦵 should start new leg", async () => {
    const game = startGame({ startpoints: 2, playerCount: 2, legs: 3 });

    game.throwDart({ score: 1, ring: "D" });

    const events = game.flush();
    const legStarted = events.find((e) => e.type === "LegStarted") as LegStarted;
    expect(legStarted.type).toBe("LegStarted");
  });
  
  it("🦵 should handle multiple legs", async () => {
    const game = startGame({ startpoints: 1, checkout: "Straight", playerCount: 2, legs: 3 });

    game.throwDart({ score: 1 }); // Player 1 wins first leg
    game.throwDart({ score: 2 }); // Player 2 overthrows
    game.throwDart({ score: 1 }); // Player 1 wins second leg and game

    const events = game.flush();
    const eventTypes = events.map(e => e.type);
    expect(eventTypes).toEqual(
      [
        'DartThrown',
        'LegWon',
        'LegStarted',
        'TurnStarted',
        'DartThrown',
        'TurnStarted',
        'DartThrown',
        'LegWon',
        'GameOver'
      ]
    );
  });

  it("👥 should change turn after 3 darts", async () => {
    const game = seedDefaultGame();

    game.throwDart(randomDart());
    game.throwDart(randomDart());
    game.throwDart(randomDart());
    const events = game.flush();

    const turnStarted = events[events.length - 1] as TurnStarted;

    expect(turnStarted.type).toBe("TurnStarted");
  });
  
  it("🏆 should set game over", async () => {
    const game = startGame({ startpoints: 2, checkout: "Double", playerCount: 2, legs: 1 });

    game.throwDart({ score: 1, ring: "D" });
    const events = game.flush();

    const turnStarted = events.find((e) => e.type === "GameOver") as GameOver;
    expect(turnStarted.type).toBe("GameOver");
    expect(turnStarted.payload.winner.playerId).toBe("0");
  });
});
