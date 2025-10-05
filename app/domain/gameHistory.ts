import { Checkout } from "../models/checkout";
import { DomainEvent, GameCreated, GameOver, LegWon, PlayerAdded } from "./events";

export type GameHistory = {
    id: string;
    createdAt: Date;
    startpoints: number;
    checkout: Checkout;
    players: { name: string, legsWon: number, gameWon: boolean }[];
};

export type PlayerState = {
    name: string;
    legsWon: number;
    gameWon: boolean;
};

export class GameHistoryProjection {
    private gameId!: string;
    private createdAt!: Date;
    private startpoints!: number;
    private checkout!: Checkout;
    private players: Map<string, PlayerState> = new Map();

    public toView(): GameHistory {
        return {
            id: this.gameId,
            createdAt: this.createdAt,
            startpoints: this.startpoints,
            checkout: this.checkout,
            players: Array.from(this.players.values()),
        };
    }

    public static from(events: DomainEvent[]) {
        return new GameHistoryProjection(events);
    }

    private constructor(events: DomainEvent[]) {
        for (const event of events) {
            this.handle(event);
        }
    }

    private handle(event: DomainEvent) {
        switch (event.type) {
            case "GameCreated":
                const gameCreated = event as GameCreated;
                this.gameId = gameCreated.gameId;
                this.checkout = gameCreated.payload.checkout;
                this.startpoints = gameCreated.payload.startpoints;
                this.createdAt = gameCreated.createdAt;
                break;
            case "PlayerAdded":
                const playerAdded = event as PlayerAdded;
                this.players.set(playerAdded.payload.id, { name: playerAdded.payload.name, legsWon: 0, gameWon: false });
                break;
            case "LegWon":
                this.handleLegWon(event as LegWon);
                break;
            case "GameOver":
                this.handleGameOver(event as GameOver);
                break;
        }
    }

    private handleLegWon(event: LegWon) {
        const player = this.players.get(event.payload.winner.playerId)!;
        player.legsWon++;
    }

    private handleGameOver(event: GameOver) {
        const player = this.players.get(event.payload.winner.playerId)!;
        player.gameWon = true;
    }

}