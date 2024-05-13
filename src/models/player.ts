import { sum } from "../utils/number";
import { Throw } from "./throw";
import { Turn } from "./turn";

export type Player = {
    id: string;
    name: string;
    turns: Turn[];
}

export function calcTotalScore(player: Player) {
    return player.turns?.flatMap(t => t.throws).map(calcScoreOfThrow).reduce(sum, 0);
}

export function calcCurrentScore(player: Player): number {
  return getCurrentTurn(player)?.throws.map(calcScoreOfThrow).reduce(sum, 0);
}

export function calcAverage(player: Player) {
    const totalScore = calcTotalScore(player);
    const totalThrows = player.turns?.flatMap(t => t.throws)?.length;
    if (totalScore === 0 || totalThrows === 0) {
        return 0;
    }
    const result = totalScore / totalThrows;
    return result.toFixed(2);
}

export function getCurrentTurn(player: Player): Turn {
    return player.turns[player.turns.length - 1];
}

export function getThrowOfTurn(player: Player, index: 0 | 1 | 2) {
    return getCurrentTurn(player)?.throws[index];
}

export function calcScoreOfThrow(t: Throw) {
    if (t.ring === "D") {
        return t.score * 2;
    }
    if (t.ring === "T") {
        return t.score * 3;
    }
    return t.score;
}

export function addThrowToPlayer(player: Player, t: Throw) {
    const currentTurn = getCurrentTurn(player);
    if (!currentTurn) {
        player.turns = [{ throws: [t] }];
        return player;
    }
    if (currentTurn?.throws?.length === 3) {
        player.turns = [...player.turns, { throws: [t] }]
    } else {
        currentTurn.throws = [...currentTurn?.throws, t];
    }
    return player;
}
