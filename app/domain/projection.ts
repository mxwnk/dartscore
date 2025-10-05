import { Checkout } from "../models/checkout";
import { calcScore, Dart } from "../models/dart";
import { PlayerState, PlayerWithPositon } from "../models/player";
import { Turn } from "../models/turn";
import { sum } from "../utils/number";
import { DartThrown, DomainEvent, GameCreated, PlayerAdded, TurnStarted, LegWon } from "./events";
import { Setup } from "../models/setup";

export type GameView = {
  gameId: string;
  setup: Setup;
  version: number;
  players: PlayerView[];
  round: {
    number: number;
    remaining: number;
  };
};

export type PlayerView = {
  id: string;
  position: number;
  name: string;
  remaining: number;
  state: PlayerState;
  average: number;
  currentTurn?: CurrentTurnView;
};

export type CurrentTurnView = {
  darts: [Dart?, Dart?, Dart?];
  total?: number;
};

export class GameProjection {
  private players: PlayerWithPositon[] = [];
  private turns: Map<string, Turn[]> = new Map();
  private gameId!: string;
  private setup!: Setup;
  private currentPlayer!: PlayerWithPositon;
  private version: number;

  public static from(events: DomainEvent[]) {
    return new GameProjection(events);
  }

  private constructor(events: DomainEvent[]) {
    for (const event of events) {
      this.handle(event);
    }
    this.version = events.length;
  }

  public toView(): GameView {
    const players = this.players.map((p) => this.toPlayerView(p));
    const roundNumber = this.turns.get(this.currentPlayer?.id)?.length ?? 1;
    const remaining = this.currentPlayer
      ? players.filter((p) => p.id === this.currentPlayer.id)[0].remaining
      : 0;
    return {
      gameId: this.gameId,
      version: this.version,
      setup: this.setup,
      players,
      round: {
        number: roundNumber,
        remaining,
      },
    };
  }

  private toPlayerView(player: PlayerWithPositon): PlayerView {
    const turns = this.turns.get(player.id) ?? [];
    const validTurns = turns.filter((t) => !t.overthrown);
    const scoredPoints = validTurns
      .flatMap((t) => t.darts)
      .map(calcScore)
      .reduce(sum, 0);
    const average = validTurns.length ? scoredPoints / validTurns.length : 0;
    const remaining = this.setup.startpoints - scoredPoints;
    const currentTurn = turns.at(-1);
    const state = () => {
      if (remaining === 0) {
        return "won";
      }
      if (currentTurn?.overthrown) {
        return "overthrown";
      }
      if (this.currentPlayer.id === player.id) {
        return "playing";
      }
      return "waiting";
    };

    return {
      ...player,
      state: state(),
      remaining,
      average: Math.round(average * 100) / 100,
      currentTurn: currentTurn
        ? {
            darts: currentTurn.darts,
            total:
              currentTurn.darts.length !== 0
                ? currentTurn.darts.map(calcScore).reduce(sum, 0)
                : undefined,
          }
        : undefined,
    };
  }

  private handle(event: DomainEvent) {
    switch (event.type) {
      case "GameCreated":
        const gameCreated = event as GameCreated;
        this.gameId = gameCreated.gameId;
        this.setup = gameCreated.payload;
        break;
      case "PlayerAdded":
        const playerAdded = event as PlayerAdded;
        this.players.push(playerAdded.payload);
        this.turns.set(playerAdded.payload.id, []);
        break;
      case "TurnStarted":
        const turnStarted = event as TurnStarted;
        this.currentPlayer = this.players.find((p) => p.id === turnStarted.payload.playerId)!;
        this.turns.get(this.currentPlayer.id)!.push({ darts: [], overthrown: false });
        break;
      case "GameStarted":
        this.players.forEach((p) => this.turns.set(p.id, []));
        break;
      case "LegWon":
        const _legWon = event as LegWon;
        this.players = this.rotatePlayersLeft(this.players);
        break;
      case "LegStarted":
        this.turns = new Map(this.players.map((p) => [p.id, []]));
        break;
      case "DartThrown":
        const { playerId, score, ring, overthrown } = (event as DartThrown).payload;
        this.currentPlayer = this.players.find((p) => p.id === playerId)!;

        const currentTurn = this.turns.get(this.currentPlayer.id)!.at(-1)!;
        currentTurn.darts.push({ score, ring });
        currentTurn.overthrown = overthrown;
        break;
    }
  }

  private rotatePlayersLeft(players: PlayerWithPositon[]) {
    const playerCount = players.length;
    return players.map((p) => ({ ...p, position: (p.position - 1 + playerCount) % playerCount }));
  }
}

