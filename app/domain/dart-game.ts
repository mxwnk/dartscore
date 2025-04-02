import { Checkout } from "@prisma/client";
import { GameState } from "../models/game";
import { PlayerDto } from "../models/player";
import { RingDto } from "../models/ring";
import { calcScoreOfThrow } from "../models/throw";
import { TurnDto } from "../models/turn";
import { sum } from "../utils/number";

export type PlayerState = "playing" | "won" | "waiting" | "overthrown";

export type DartThrow = {
    ring: RingDto | null;
    score: number;
}

export type NewGame = {
    players: PlayerDto[],
    startpoints: number,
    checkout: Checkout
}

export class DartGame {

    static fromGameState(gameState: GameState) {
        return new DartGame(gameState);
    }

    private constructor(private state: GameState) {

    }

    public getId() {
        return this.state.id;
    }

    public isGameOver(): boolean {
        return this.state.players.every(p => this.hasPlayerWon(p.id));
    }

    public getGameState(): GameState {
        return this.state;
    }

    public getRounds(): number {
        const firstPlayer = this.state.players.at(0);
        return this.state.turns.filter(t => t.playerId === firstPlayer?.id).length;
    }

    public getMissingScore(playerId: string): number {
        return this.state.startpoints - this.getCurrentScore(playerId);
    }

    public getAverageScore(playerId: string): number {
        const playerTurns = this.state.turns.filter(t => t.playerId === playerId);
        if (playerTurns.length === 0) {
            return 0;
        }
        return this.getCurrentScore(playerId) / playerTurns.length;
    }

    public getStartpoints(): number {
        return this.state.startpoints;
    }

    public getCheckout(): Checkout {
        return this.state.checkout;
    }

    public getCurrentTurn(playerId: string): TurnDto | undefined {
        return this.state.turns.findLast(t => t.playerId === playerId);
    }

    public hasPlayerWon(playerId: string) {
        const currentScore = this.getCurrentScore(playerId);
        return currentScore === this.state.startpoints;
    }

    public getPlayers(): PlayerDto[] {
        return this.state.players;
    }

    public getCurrentScore(playerId: string) {
        return this.state.turns
            .filter(t => !t.overthrown && t.playerId === playerId)
            .flatMap(t => t.throws)
            .map(calcScoreOfThrow)
            .reduce(sum, 0);
    }

    public getPlayerById(id: string): PlayerDto {
        const player = this.getPlayers().find(p => p.id === id);
        if (!player) {
            throw Error(`Player with id ${id} not found!`);
        }
        return player;
    }

    public getPlayerState(playerId: string): PlayerState {
        if (this.hasPlayerWon(playerId)) {
            return "won";
        }
        const currentPlayer = this.getCurrentPlayer();
        if (currentPlayer?.id === playerId) {
            return "playing";
        }
        if (this.getCurrentTurn(playerId)?.overthrown) {
            return 'overthrown';
        }
        return "waiting";
    }

    public getCurrentPlayer(): PlayerDto | undefined {
        const allPlayers = this.getPlayers();
        const lastTurn = this.state.turns.at(-1);
        if (!lastTurn) {
            return allPlayers.at(0);
        }

        const lastPlayer = this.getPlayerById(lastTurn.playerId);
        if (lastTurn.throws?.length < 3 && !lastTurn?.overthrown) {
            return lastPlayer;
        }
        return undefined;
    }

    public getNextPlayer(): PlayerDto | undefined {
        const allPlayers = this.getPlayers();
        const currentTurn = this.state.turns.at(-1);
        if (!currentTurn) {
            return allPlayers.at(0);
        }
        const currentPlayerIndex = allPlayers.findIndex(p => p.id === currentTurn.playerId);
        for (let index = 1; index <= allPlayers.length + 1; index++) {
            const nextPlayerIndex = (currentPlayerIndex + index) % allPlayers.length;
            const nextPlayer = allPlayers.at(nextPlayerIndex) as PlayerDto;
            if (!this.hasPlayerWon(nextPlayer.id)) {
                return nextPlayer;
            }
        }
        return undefined;
    }

    public isWrongCheckout(turn: TurnDto) {
        if (this.state.checkout === "Straight") {
            return false;
        }
        const missingScore = this.getMissingScore(turn.playerId);
        if (missingScore >= 2) {
            return false;
        }
        if (missingScore === 1) {
            return true;
        }
        return turn.throws.at(-1)!.ring !== "D";
    }

    public isTurnOver() {
        const currentTurn = this.state.turns.at(-1);
        if (!currentTurn) {
            return false;
        }
        return currentTurn.throws.length === 3 || currentTurn.overthrown || this.hasPlayerWon(currentTurn.playerId);
    }
}
