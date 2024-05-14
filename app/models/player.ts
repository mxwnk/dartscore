import { GameDto } from "./game";
import { TurnDto } from "./turn";

export type PlayerDto = GameDto["players"]["0"];

export function getCurrentTurnOfPlayer(player: PlayerDto): TurnDto {
    return player.turns[player.turns.length - 1];
}
