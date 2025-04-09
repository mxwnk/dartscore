import { createId } from '@paralleldrive/cuid2';
import { dartThrownEvent, DartThrown, DomainEvent, GameCreated, gameCreatedEvent, PlayerAdded, playerAddedEvent } from "./events";
import { sum } from '../utils/number';
import { Turn } from '../models/turn';
import { calcScore, Dart } from '../models/dart';
import { Player } from '../models/player';
import { Checkout } from '../models/checkout';

export class Game {
    private id: string;
    private events: DomainEvent[] = [];
    private players: { playerId: string, name: string }[] = [];
    private startpoints!: number;
    private checkout!: Checkout;
    private currentPlayerId: string = "";
    private turns: Map<string, Turn[]> = new Map();

    public static start(setup?: { startpoints?: number, checkout?: Checkout }) {
        const gameCreated = gameCreatedEvent({
            gameId: createId(),
            startpoints: setup?.startpoints ?? 301,
            checkout: setup?.checkout ?? "Straight"
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

    public addPlayer(player: Player) {
        const gameId = this.id;
        const playerAdded = playerAddedEvent({ gameId, playerId: player.id, name: player.name });
        this.apply(playerAdded);
    }

    public throwDart(dart: Dart) {
        if (this.isGameOver()) {
            return;
        }
        const overthrown = this.isWrongCheckout(dart);
        const dartThrown = dartThrownEvent({
            gameId: this.id, payload: {
                playerId: this.currentPlayerId,
                overthrown,
                ...dart
            }
        });
        this.apply(dartThrown);
    }

    public flush(): DomainEvent[] {
        const newEvents = JSON.parse(JSON.stringify(this.events));
        this.events = [];
        return newEvents;
    }

    private isWrongCheckout(dartThrow: Dart) {
        const missingScore = this.calculateMissingScore(this.currentPlayerId);
        const currentScore = calcScore(dartThrow);
        const newMissingScore = missingScore - currentScore;
        if (newMissingScore < 0) {
            return true;
        }
        if (this.checkout == "Double" && newMissingScore === 1) {
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
        return this.startpoints - playerTurns
            .filter(t => !t.overthrown)
            .map(t => t.darts)
            .flatMap(x => x)
            .map(calcScore)
            .reduce(sum)
    }

    private isGameOver() {
        return this.players.every(p => this.hasPlayerWon(p.playerId));
    }

    private apply(event: DomainEvent) {
        /** @ts-ignore */
        this[`apply${event.type}`](event);
        this.events.push(event);
    }

    private applyGameCreated(event: GameCreated) {
        this.id = event.gameId;
        this.startpoints = event.payload.startpoints;
        this.checkout = event.payload.checkout;
    }

    private applyPlayerAdded(event: PlayerAdded) {
        if (this.players.length === 0) {
            this.currentPlayerId = event.payload.playerId;
        }
        this.players.push(event.payload);
    }

    private applyDartThrown(event: DartThrown) {
        const { playerId, score, ring, overthrown } = event.payload;

        if (!this.turns.has(playerId)) {
            this.turns.set(playerId, []);
        }

        const playerTurns = this.turns.get(playerId)!;


        if (playerTurns.length === 0 || playerTurns.at(-1)!.darts.length >= 3 || playerTurns.at(-1)?.overthrown) {
            playerTurns.push({ darts: [], overthrown: false });
        }

        const currentTurn = playerTurns.at(-1)!;
        currentTurn.darts.push({ score, ring });
        currentTurn.overthrown = overthrown;

        const isTurnOver = currentTurn.darts.length === 3 || currentTurn.overthrown || this.hasPlayerWon(playerId);
        if (!isTurnOver) {
            return;
        }
        const currentPlayerIndex = this.players.findIndex(p => p.playerId === this.currentPlayerId);
        for (let index = 1; index <= this.players.length + 1; index++) {
            const nextPlayerIndex = (currentPlayerIndex + index) % this.players.length;
            const nextPlayer = this.players.at(nextPlayerIndex)!;
            if (this.hasPlayerWon(nextPlayer.playerId)) {
                continue;
            }
            this.currentPlayerId = nextPlayer.playerId;
            break;
        }
    }
}
