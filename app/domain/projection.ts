import { Checkout } from "../models/checkout";
import { calcScore, Dart } from "../models/dart";
import { PlayerState, PlayerWithPositon } from "../models/player";
import { calcScoreOfTurns, findNextPlayer, Turn } from "../models/turn";
import { sum } from "../utils/number";
import { DartThrown, DomainEvent, GameCreated, PlayerAdded } from "./events";

export type GameView = {
  gameId: string;
  version: number;
  startpoints: number;
  checkout: Checkout;
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
  private startpoints!: number;
  private checkout!: Checkout;
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
      checkout: this.checkout,
      startpoints: this.startpoints,
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
    const remaining = this.startpoints - scoredPoints;
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
        this.checkout = gameCreated.payload.checkout;
        this.startpoints = gameCreated.payload.startpoints;
        break;
      case "PlayerAdded":
        const playerAdded = event as PlayerAdded;
        if (this.players.length === 0) {
          this.currentPlayer = playerAdded.payload;
        }
        this.players.push(playerAdded.payload);
        this.turns.set(playerAdded.payload.id, []);
        break;
      case "DartThrown":
        const { playerId, score, ring, overthrown } = (event as DartThrown)
          .payload;
        this.currentPlayer = this.players.find((p) => p.id === playerId)!;
        const playerTurns = this.turns.get(playerId)!;
        if (this.newTurnRequired(playerId)) {
          playerTurns.push({ darts: [], overthrown: false });
        }

        const currentTurn = playerTurns.at(-1)!;
        currentTurn.darts.push({ score, ring });
        currentTurn.overthrown = overthrown;

        const isTurnOver =
          currentTurn.darts.length === 3 ||
          currentTurn.overthrown ||
          this.hasPlayerWon(playerId);
        if (!isTurnOver) {
          return;
        }

        const nextPlayer = findNextPlayer({
          playerTurns: this.turns,
          startpoints: this.startpoints,
          players: this.players,
          currentPlayer: this.currentPlayer,
        });
        if (nextPlayer) {
          this.currentPlayer = nextPlayer;
          const nextPlayerTurns = this.turns.get(nextPlayer.id)!;
          nextPlayerTurns.push(newTurn());
        }
        break;
    }
  }

  private hasPlayerWon(playerId: string) {
    return this.calculateMissingScore(playerId) === 0;
  }

  private calculateMissingScore(playerId: string) {
    const playerTurns = this.turns.get(playerId);
    if (!playerTurns || playerTurns.length === 0) {
      return this.startpoints;
    }
    return this.startpoints - calcScoreOfTurns(playerTurns);
  }

  private newTurnRequired(playerId: string) {
    const playerTurns = this.turns.get(playerId)!;
    if (playerTurns.length === 0) {
      return true;
    }
    const lastTurn = playerTurns.at(-1)!;
    return lastTurn.overthrown || lastTurn.darts.filter(Boolean).length >= 3;
  }
}

function newTurn(): Turn {
  return { darts: [], overthrown: false };
}
