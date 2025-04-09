import { calcScore, Dart } from "../models/dart";
import { PlayerState } from "../models/player";
import { Turn } from "../models/turn";
import { sum } from "../utils/number";
import { Checkout, DartThrown, DomainEvent, GameCreated, PlayerAdded } from "./events";

export type GameView = {
    gameId: string;
    startpoints: number;
    checkout: Checkout;
    players: PlayerView[];
    round: {
        number: number;
        remaining: number;
    }
};

export type PlayerView = {
    playerId: string;
    name: string;
    remaining: number;
    state: PlayerState;
    average: number;
    currentTurn?: CurrentTurnView;
};

export type CurrentTurnView = {
    darts: [Dart?, Dart?, Dart?];
    total?: number;
}

export class GameProjection {
    private players: { playerId: string, name: string }[] = [];
    private turns: Map<string, Turn[]> = new Map();
    private gameId!: string;
    private startpoints!: number;
    private checkout!: Checkout;
    private currentPlayerId!: string;

    public static from(events: DomainEvent[]) {
        return new GameProjection(events);
    }

    private constructor(events: DomainEvent[]) {
        for (const event of events) {
            this.handle(event);
        }
    }

    public toView(): GameView {
        const players = this.players.map(p => this.toPlayerView(p));
        const roundNumber = this.turns.get(this.currentPlayerId)?.length ?? 1;
        const remaining = players.filter(p => p.playerId === this.currentPlayerId)[0].remaining;
        return {
            gameId: this.gameId,
            checkout: this.checkout,
            startpoints: this.startpoints,
            players,
            round: {
                number: roundNumber,
                remaining
            }
        };
    }

    private toPlayerView(player: { name: string, playerId: string }): PlayerView {
        const turns = this.turns.get(player.playerId) ?? [];
        const validTurns = turns.filter(t => !t.overthrown);
        const scoredPoints = validTurns.flatMap(t => t.darts).map(calcScore).reduce(sum, 0);
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
            if (this.currentPlayerId === player.playerId) {
                return "playing";
            }
            return "waiting";
        }

        return {
            playerId: player.playerId,
            name: player.name,
            state: state(),
            remaining,
            average: Math.round(average * 100) / 100,
            currentTurn: currentTurn ? {
                darts: currentTurn.darts,
                total: currentTurn.darts.length !== 0 ? currentTurn.darts.map(calcScore).reduce(sum, 0) : undefined,
            } : undefined
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
                    this.currentPlayerId = playerAdded.payload.playerId;
                }
                this.players.push(playerAdded.payload);
                this.turns.set(playerAdded.payload.playerId, []);
                break;
            case "DartThrown":
                const { playerId, score, ring, overthrown } = (event as DartThrown).payload;
                this.currentPlayerId = playerId;
                const playerTurns = this.turns.get(playerId)!;
                if (this.newTurnRequired(playerId)) {
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
                    const nextPlayerTurns = this.turns.get(nextPlayer.playerId)!;
                    nextPlayerTurns.push(newTurn());
                    this.currentPlayerId = nextPlayer.playerId;
                    break;
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
        return this.startpoints - playerTurns
            .filter(t => !t.overthrown)
            .map(t => t.darts)
            .flatMap(x => x)
            .map(calcScore)
            .reduce(sum)
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