import { Checkout } from "../models/checkout";
import { DomainEvent, GameCreated, PlayerAdded } from "./events";

export type GameHistory = {
    id: string;
    createdAt: Date;
    startpoints: number;
    checkout: Checkout;
    playersNames: string[];
};

export class GameHistoryProjection {
    private gameId!: string;
    private createdAt!: Date;
    private startpoints!: number;
    private checkout!: Checkout;
    private playersNames: string[] = [];

    public toView(): GameHistory {
        return {
            id: this.gameId,
            createdAt: this.createdAt,
            startpoints: this.startpoints,
            checkout: this.checkout,
            playersNames: this.playersNames,
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
                this.playersNames.push(playerAdded.payload.name );
                break;
        }
    }

}