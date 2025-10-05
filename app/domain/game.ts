import {
  DartThrown,
  DomainEvent,
  GameCreated,
  GameOver,
  GameStarted,
  LegStarted,
  LegWon,
  PlayerAdded,
  TurnStarted,
  dartThrownEvent,
  gameCreatedEvent,
  gameOverEvent,
  gameStartedEvent,
  legStartedEvent,
  legWonEvent,
  playerAddedEvent,
  turnStartedEvent,
} from "./events";
import { calcScoreOfTurns, findNextPlayer, Turn } from "../models/turn";
import { calcScore, Dart } from "../models/dart";
import { Player, PlayerWithPositon } from "../models/player";
import { Checkout } from "../models/checkout";
import { createGameId } from "../models/id";
import { Setup } from "../models/setup";

export class Game {
  private id: string;
  private events: DomainEvent[] = [];

  private setup!: Setup;
  private gameStarted: boolean = false;
  private gameOver: boolean = false;

  private players: PlayerWithPositon[] = [];
  private currentPlayer!: PlayerWithPositon;
  private playerTurns: Map<string, Turn[]> = new Map();

  private playerLegs: Map<string, number> = new Map();
  private currentLeg: number = 0;

  public static create(setup?: { startpoints?: number; checkout?: Checkout, legs?: number }) {
    const gameCreated = gameCreatedEvent({
      gameId: createGameId(),
      startpoints: setup?.startpoints ?? 301,
      checkout: setup?.checkout ?? "Straight",
      legs: setup?.legs ?? 3,
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

    const legStarted = legStartedEvent({ gameId: this.id, createdBy: gameStarted.id });
    this.apply(legStarted);

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

    if (this.isLegWon()) {
      return this.handleLegWon(dartThrown);
    }

    if (this.isTurnOver()) {
      this.startNewTurn(dartThrown);
    }
  }

  private isLegWon() {
    return this.calculateMissingScore(this.currentPlayer.id) === 0;
  }

  private handleLegWon(dartThrown: DartThrown) {
    const legWon = legWonEvent({
      gameId: this.id,
      createdBy: dartThrown.id,
      payload: { winner: { playerId: this.currentPlayer.id } },
    });
    this.apply(legWon);

    if (this.isGameOver()) {
      const playerWon = gameOverEvent({
        gameId: this.id,
        createdBy: dartThrown.id,
        payload: { winner: { playerId: this.currentPlayer.id } },
      });
      this.apply(playerWon);
      return;
    }

    const legStarted = legStartedEvent({ gameId: this.id, createdBy: dartThrown.id });
    this.apply(legStarted);

    const nextStarter = this.players.find((p) => p.position === 0)!;
    const turnStarted = turnStartedEvent({
      gameId: this.id,
      createdBy: dartThrown.id,
      payload: { playerId: nextStarter.id },
    });
    this.apply(turnStarted);
  }

  private isTurnOver() {
    const playerTurns = this.playerTurns.get(this.currentPlayer.id)!;
    const currentTurn = playerTurns.at(-1)!;
    return currentTurn.darts.length === 3 || currentTurn.overthrown;
  }

  private startNewTurn(dartThrown: DartThrown) {
    const nextPlayer = findNextPlayer({
      playerTurns: this.playerTurns,
      currentPlayer: this.currentPlayer,
      startpoints: this.setup.startpoints,
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
    if (this.setup.checkout == "Double" && newMissingScore === 1) {
      return true;
    }
    if (
      this.setup.checkout == "Double" &&
      dartThrow.ring !== "D" &&
      newMissingScore === 0
    ) {
      return true;
    }
    return false;
  }

  private calculateMissingScore(playerId: string) {
    const playerTurns = this.playerTurns.get(playerId);
    if (!playerTurns) {
      return this.setup.startpoints;
    }
    return this.setup.startpoints - calcScoreOfTurns(playerTurns);
  }

  private isGameOver() {
    if (this.gameOver) {
      return true;
    }
    const legsToWin = Math.ceil(this.setup.legs / 2);
    return this.players.some((p) => this.playerLegs.get(p.id)! === legsToWin);
  }

  private apply(event: DomainEvent) {
    switch (event.type) {
      case "GameCreated":
        this.applyGameCreated(event as GameCreated);
        break;
      case "PlayerAdded":
        this.applyPlayerAdded(event as PlayerAdded);
        break;
      case "GameStarted":
        this.applyGameStarted(event as GameStarted);
        break;
      case "LegStarted":
        this.applyLegStarted(event as LegStarted);
        break;
      case "TurnStarted":
        this.applyTurnStarted(event as TurnStarted);
        break;
      case "DartThrown":
        this.applyDartThrown(event as DartThrown);
        break;
      case "LegWon":
        this.applyLegWon(event as LegWon);
        break;
      case "GameOver":
        this.applyGameOver(event as GameOver);
        break;
      default:
        const exhaustiveCheck: never = event.type;
        throw new Error(`Unhandled case: ${exhaustiveCheck}`);
    }
    this.events.push(event);
  }

  private applyGameOver(_: GameOver) {
    this.gameOver = true;
  }

  private applyGameStarted(_: GameStarted) {
    this.gameStarted = true;
  }

  private applyGameCreated(event: GameCreated) {
    this.id = event.gameId;
    this.setup = event.payload;
  }

  private applyPlayerAdded(event: PlayerAdded) {
    if (this.players.length === 0) {
      this.currentPlayer = event.payload;
    }
    this.players.push(event.payload);
    this.playerTurns.set(event.payload.id, []);
    this.playerLegs.set(event.payload.id, 0);
  }

  private applyTurnStarted(event: TurnStarted) {
    this.currentPlayer = this.players.find((p) => p.id === event.payload.playerId)!;
    this.playerTurns.get(event.payload.playerId)!.push({ darts: [], overthrown: false });
  }

  private applyDartThrown(event: DartThrown) {
    const { playerId, score, ring, overthrown } = event.payload;
    const playerTurns = this.playerTurns.get(playerId)!;
    const currentTurn = playerTurns.at(-1)!;
    currentTurn.darts.push({ score, ring });
    currentTurn.overthrown = overthrown;
  }

  private applyLegWon(event: LegWon) {
    const playerCount = this.players.length;
    this.players = this.players.map((p) => ({ ...p, position: (p.position - 1 + playerCount) % playerCount }));

    const playerLegs = this.playerLegs.get(event.payload.winner.playerId)!;
    this.playerLegs.set(event.payload.winner.playerId, playerLegs + 1);
    this.currentLeg++;
  }

  private applyLegStarted(_event: LegStarted) {
    // reset turns for a fresh leg
    this.playerTurns = new Map(this.players.map((p) => [p.id, [] as Turn[]]));
    // the new starter is the player with position 0; current turn will be opened by the subsequent TurnStarted event
    const starter = this.players.find((p) => p.position === 0)!;
    this.currentPlayer = starter;
  }
}
