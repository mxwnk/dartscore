import { saveDartThrow, saveGame, createNewTurn, deleteThrow, deleteTurn, setOverthrown, resetOverthrown } from "../db/actions";
import { GameDto } from "../models/game";
import { PlayerDto } from "../models/player";
import { RingDto } from "../models/ring";
import { calcScoreOfThrow } from "../models/throw";
import { TurnDto } from "../models/turn";
import { sum } from "../utils/number";

export type PlayerState = "playing" | "won" | "waiting" | "overthrown";

export type DartThrow = {
    ring: RingDto | null;
    score: number;
    playerId: string;
}

export class DartGame {
    static fromGameState(gameState: GameDto) {
        return new DartGame(gameState);
    }

    static async startNewGame(players: PlayerDto[]) {
        return await saveGame(players);
    }

    private constructor(private gameState: GameDto) {

    }

    public getId() {
        return this.gameState.id;
    }

    public isGameOver(): boolean {
        return this.gameState.players.every(p => this.hasPlayerWon(p.id));
    }

    public getRounds(): number {
        const firstPlayer = this.gameState.players.at(0);
        return this.gameState.turns.filter(t => t.playerId === firstPlayer?.id).length;
    }

    public getMissingScore(playerId: string): number {
        return this.gameState.startpoints - this.getCurrentScore(playerId);
    }

    public getAverageScore(playerId: string): number {
        const playerTurns = this.gameState.turns.filter(t => t.playerId === playerId);
        if (playerTurns.length === 0) {
            return 0;
        }
        return this.getCurrentScore(playerId) / playerTurns.length;
    }

    public getStartPoints(): number {
        return this.gameState.startpoints;
    }

    public getCurrentTurn(playerId: string): TurnDto | undefined {
        return this.gameState.turns.findLast(t => t.playerId === playerId);
    }

    public hasPlayerWon(playerId: string) {
        const currentScore = this.getCurrentScore(playerId);
        return currentScore === this.gameState.startpoints;
    }

    public getPlayers(): PlayerDto[] {
        return this.gameState.players;
    }

    public getCurrentScore(playerId: string) {
        return this.gameState.turns
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
        const lastTurn = this.gameState.turns.at(-1);
        if (!lastTurn) {
            return allPlayers.at(0);
        }

        const lastPlayer = this.getPlayerById(lastTurn.playerId);
        if (lastTurn.throws?.length < 3 && !lastTurn?.overthrown) {
            return lastPlayer;
        }
        return this.getNextPlayer(lastPlayer);
    }

    public async addDartThrow(dartThrow: DartThrow) {
        let currentTurn = this.gameState.turns.at(-1);
        if (!currentTurn) {
            return;
        }
        const currentPlayer = this.getPlayerById(currentTurn.playerId);
        const newThrow = await saveDartThrow({ turnId: currentTurn.id, dartThrow });
        currentTurn.throws = [...currentTurn.throws, newThrow];
        if (this.getMissingScore(currentTurn.playerId) < 0) {
            currentTurn = await setOverthrown(currentTurn.id);
        }
        const nextPlayer = this.getNextPlayer(currentPlayer);
        if (this.isTurnOver(currentTurn) && nextPlayer) {
            const newTurn = await createNewTurn({ gameId: this.getId(), playerId: nextPlayer.id })
            this.gameState.turns = [...this.gameState.turns, newTurn];
        }
    }

    public async undo() {
        const allThrows = this.gameState.turns.flatMap(t => t.throws);
        const lastThrow = allThrows.at(-1);
        if (allThrows.length === 0 || !lastThrow) {
            return;
        }
        await deleteThrow(lastThrow.id);
        await resetOverthrown(lastThrow.turnId);
        const currentTurn = this.gameState.turns.at(-1);
        if (currentTurn && lastThrow.turnId !== currentTurn?.id) {
            deleteTurn(currentTurn.id);
        }
    }

    private getNextPlayer(currentPlayer: PlayerDto): PlayerDto | undefined {
        const allPlayers = this.getPlayers();
        const lastPlayerIndex = allPlayers.findIndex(p => p.id === currentPlayer.id);
        for (let index = 1; index <= allPlayers.length + 1; index++) {
            const nextPlayerIndex = (lastPlayerIndex + index) % allPlayers.length;
            const nextPlayer = allPlayers.at(nextPlayerIndex) as PlayerDto;
            if (!this.hasPlayerWon(nextPlayer.id)) {
                return nextPlayer;
            }
        }
        return undefined;
    }

    private isTurnOver(turn: TurnDto) {
        return turn.throws.length === 3 || turn.overthrown || this.hasPlayerWon(turn.playerId);
    }
}
