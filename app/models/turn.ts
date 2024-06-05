import { sum } from "../utils/number";
import { GameDto } from "./game";
import { calcScoreOfThrow as calcTotalScoreOfThrow } from "./throw";

export type TurnDto = GameDto["turns"]["0"];

type SimpleTurnDto = Omit<TurnDto, "playerId" | "gameId">

export function calcTotalScoreOfTurns(turns: SimpleTurnDto[]) {
    return turns.filter(t => !t.overthrown).flatMap(t => t.throws).map(calcTotalScoreOfThrow).reduce(sum, 0);
}

export function calcTotalScoreOfTurn(turn?: SimpleTurnDto) {
    return turn?.throws.map(calcTotalScoreOfThrow).reduce(sum, 0);
}
