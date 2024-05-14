import { sum } from "../../app/utils/number";
import { PlayerDto, TurnDto, ThrowDto } from "@/app/models/game"

export function calcTotalScore(player: PlayerDto) {
    return player.turns?.flatMap(t => t.throws).map(calcScoreOfThrow).reduce(sum, 0);
}

export function calcCurrentScore(player: PlayerDto): number | undefined {
    const throws = getCurrentTurn(player)?.throws;
    if (!throws || throws.length === 0) {
        return undefined;
    }
    return throws.map(calcScoreOfThrow).reduce(sum, 0);
}

export function calcAverage(player: PlayerDto) {
    const totalScore = calcTotalScore(player);
    const totalThrows = player.turns?.flatMap(t => t.throws)?.length;
    if (totalScore === 0 || totalThrows === 0) {
        return 0;
    }
    const result = totalScore / totalThrows;
    return result.toFixed(2);
}

export function getCurrentTurn(player: PlayerDto): TurnDto {
    return player.turns[player.turns.length - 1];
}

export function getThrowOfTurn(player: PlayerDto, index: 0 | 1 | 2) {
    return getCurrentTurn(player)?.throws[index];
}

export function calcScoreOfThrow(t: ThrowDto) {
    if (t.ring === "D") {
        return t.score * 2;
    }
    if (t.ring === "T") {
        return t.score * 3;
    }
    return t.score;
}
