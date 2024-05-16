import { getGameById } from "../play/get-game";
import { PlayerDto, hasPlayerWon } from "./player";
import { ThenArg } from "../utils/promise";

export type GameDto = ThenArg<ReturnType<typeof getGameById>>

export function getCurrentPlayer(game: GameDto) {
    return getCurrentTurn(game).player;
}

export function getCurrentTurn(game: GameDto) {
    return game.turns[game.turns.length - 1];
}

export function getWinners(game: GameDto): PlayerDto[] {
    return [];
}

export function isGameOver(game: GameDto) {
    return game.players.every(p => hasPlayerWon(p, game.startpoints));
}