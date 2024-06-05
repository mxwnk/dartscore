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

export function calcAverageOfTurns(turns: SimpleTurnDto[]) {
    if (turns.length === 0 || (turns.length === 1 && turns[0].throws.length === 0)) {
        return 0;
    }
    const turnsWithThrows = turns.filter(t => t.throws.length > 0 && !t.overthrown);
    const result = turnsWithThrows.map(calcTotalOfTurn).reduce(sum, 0) / turnsWithThrows.length;
    return result.toFixed(2);
}

export function calcTotalOfTurn(turn: SimpleTurnDto) {
    if (turn.throws?.length === 0) {
        return 0;
    }
    return turn.throws.map(calcTotalScoreOfThrow).reduce(sum);
}
