import { GameDto } from "./game";
import { TurnDto, calcTotalScoreOfTurns } from "./turn";

export type PlayerDto = GameDto["players"]["0"];

export function getCurrentTurnOfPlayer(player: PlayerDto): TurnDto {
    return player.turns[player.turns.length - 1];
}

export function hasPlayerWon(player: { turns: TurnDto[] }, startpoints: number) {
    const totalScore = calcTotalScoreOfTurns(player.turns);
    return startpoints === totalScore;
}
