import {
  dartThrownEvent,
  DartThrown,
  DomainEvent,
  GameCreated,
  gameCreatedEvent,
  PlayerAdded,
  playerAddedEvent,
  TurnStarted,
  playerWonEvent,
  PlayerWon,
  turnStartedEvent,
  gameStartedEvent,
  GameStarted,
} from "./events";
import { calcScoreOfTurns, findNextPlayer, Turn } from "../models/turn";
import { calcScore, Dart } from "../models/dart";
import { Player, PlayerWithPositon } from "../models/player";
import { Checkout } from "../models/checkout";
import { createGameId } from "../models/id";

export class Game {
  private id: string;
  private events: DomainEvent[] = [];
  private players: PlayerWithPositon[] = [];
  private startpoints!: number;
  private checkout!: Checkout;
  private currentPlayer!: PlayerWithPositon;
  private turns: Map<string, Turn[]> = new Map();
  private gameStarted: boolean = false;

  public static create(setup?: { startpoints?: number; checkout?: Checkout }) {
    const gameCreated = gameCreatedEvent({
      gameId: createGameId(),
      startpoints: setup?.startpoints ?? 301,
      checkout: setup?.checkout ?? "Straight",
    });
    return new Game([gameCreated]);
  }

  public static from(events: DomainEvent[]) {
    const game = new Game(events);
    game.flush();
    return game;
  }

  public getId(): string {
    return this.id;
  }

  private constructor(events: DomainEvent[]) {
    const id = events[0].gameId;
    this.id = id;
    for (const event of events) {
      this.apply(event);
    }
  }

  public start() {
    const gameStarted = gameStartedEvent({ gameId: this.id });
    this.apply(gameStarted);

    const turnStarted = turnStartedEvent({
      gameId: this.id,
      createdBy: gameStarted.id,
      payload: { playerId: this.currentPlayer.id },
    });
    this.apply(turnStarted);
  }

  public addPlayer(player: Player) {
    if (this.gameStarted) {
      throw new Error("Game already started");
    }
    const gameId = this.id;
    const position = this.players.length;
    const playerAdded = playerAddedEvent({
      gameId,
      payload: { id: player.id, name: player.name, position },
    });
    this.apply(playerAdded);
  }

  public flush(): DomainEvent[] {
    const newEvents = JSON.parse(JSON.stringify(this.events));
    this.events = [];
    return newEvents;
  }

  public throwDart(dart: Dart) {
    if (this.isGameOver()) {
      return;
    }
    const dartThrown = this.handleDartThrow(dart);

    const isTurnOver = this.handleIsTurnOver(dartThrown);

    if (!isTurnOver) {
      return;
    }

    this.handleNextTurn(dartThrown);
  }

  private handleNextTurn(dartThrown: DartThrown) {
    const nextPlayer = findNextPlayer({
      playerTurns: this.turns,
      currentPlayer: this.currentPlayer,
      startpoints: this.startpoints,
      players: this.players,
    });

    if (!nextPlayer) {
      return;
    }

    const turnStarted = turnStartedEvent({
      gameId: this.id,
      createdBy: dartThrown.id,
      payload: { playerId: nextPlayer.id },
    });
    this.apply(turnStarted);
  }

  private handleIsTurnOver(dartThrown: DartThrown) {
    const playerTurns = this.turns.get(this.currentPlayer.id)!;
    const currentTurn = playerTurns.at(-1)!;
    const hasPlayerWon = this.hasPlayerWon(this.currentPlayer.id);

    if (hasPlayerWon) {
      const playerWon = playerWonEvent({
        gameId: this.id,
        createdBy: dartThrown.id,
        payload: { playerId: this.currentPlayer.id },
      });
      this.apply(playerWon);
    }

    return currentTurn.darts.length === 3 || currentTurn.overthrown || hasPlayerWon;
  }

  private handleDartThrow(dart: Dart) {
    const overthrown = this.isWrongCheckout(dart);
    const dartThrown = dartThrownEvent({
      gameId: this.id,
      payload: {
        playerId: this.currentPlayer.id,
        overthrown,
        ...dart,
      },
    });
    this.apply(dartThrown);
    return dartThrown;
  }

  private isWrongCheckout(dartThrow: Dart) {
    const missingScore = this.calculateMissingScore(this.currentPlayer.id);
    const currentScore = calcScore(dartThrow);
    const newMissingScore = missingScore - currentScore;
    if (newMissingScore < 0) {
      return true;
    }
    if (this.checkout == "Double" && newMissingScore === 1) {
      return true;
    }
    if (
      this.checkout == "Double" &&
      dartThrow.ring !== "D" &&
      newMissingScore === 0
    ) {
      return true;
    }
    return false;
  }

  private hasPlayerWon(playerId: string) {
    return this.calculateMissingScore(playerId) === 0;
  }

  private calculateMissingScore(playerId: string) {
    const playerTurns = this.turns.get(playerId);
    if (!playerTurns) {
      return this.startpoints;
    }
    return this.startpoints - calcScoreOfTurns(playerTurns);
  }

  private isGameOver() {
    return this.players.every((p) => this.hasPlayerWon(p.id));
  }

  private apply(event: DomainEvent) {
    switch (event.type) {
      case "GameCreated":
        this.applyGameCreated(event as GameCreated);
        break;
      case "PlayerAdded":
        this.applyPlayerAdded(event as PlayerAdded);
        break;
      case "DartThrown":
        this.applyDartThrown(event as DartThrown);
        break;
      case "TurnStarted":
        this.applyTurnStarted(event as TurnStarted);
        break;
      case "GameStarted":
        this.applyGameStarted(event as GameStarted);
        break;
      case "PlayerWon":
        this.applyPlayerWon(event as PlayerWon);
        break;
      default:
        const exhaustiveCheck: never = event.type;
        throw new Error(`Unhandled color case: ${exhaustiveCheck}`);
    }
    this.events.push(event);
  }

  private applyPlayerWon(event: PlayerWon) {
    // throw new Error("Method not implemented.");
  }

  private applyGameStarted(event: GameStarted) {
    this.gameStarted = true;
  }

  private applyGameCreated(event: GameCreated) {
    this.id = event.gameId;
    this.startpoints = event.payload.startpoints;
    this.checkout = event.payload.checkout;
  }

  private applyPlayerAdded(event: PlayerAdded) {
    if (this.players.length === 0) {
      this.currentPlayer = event.payload;
    }
    this.players.push(event.payload);
    this.turns.set(event.payload.id, []);
  }

  private applyTurnStarted(event: TurnStarted) {
    this.currentPlayer = this.players.find((p) => p.id === event.payload.playerId)!;
    this.turns.get(event.payload.playerId)!.push({ darts: [], overthrown: false });
  }

  private applyDartThrown(event: DartThrown) {
    const { playerId, score, ring, overthrown } = event.payload;
    const playerTurns = this.turns.get(playerId)!;
    const currentTurn = playerTurns.at(-1)!;
    currentTurn.darts.push({ score, ring });
    currentTurn.overthrown = overthrown;
  }
}
