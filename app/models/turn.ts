import { sum } from "../utils/number";
import { calcScore, Dart } from "./dart";
import { PlayerWithPositon } from "./player";

export type Turn = { darts: [Dart?, Dart?, Dart?], overthrown: boolean };

export function calcScoreOfTurns(turns: Turn[]) {
    return turns
        .filter(t => !t.overthrown)
        .map(t => t.darts)
        .flatMap(x => x)
        .map(calcScore)
        .reduce(sum, 0);
}

export function findNextPlayer({ playerTurns, currentPlayer, startpoints, players }: { playerTurns: Map<string, Turn[]>, currentPlayer: PlayerWithPositon, players: PlayerWithPositon[], startpoints: number }): PlayerWithPositon | undefined {
    let nextPlayer = undefined;
    for (let index = 1; index <= players.length + 1; index++) {
        const nextPosition = (currentPlayer.position + index) % players.length;
        nextPlayer = players.find(p => p.position === nextPosition)!;
        const nextPlayerTurns = playerTurns.get(nextPlayer.id);
        if (hasWon(startpoints, nextPlayerTurns)) {
            continue;
        }
        break;
    }
    return nextPlayer;
}

function hasWon(startpoints: number, turns?: Turn[], ) {
    if (!turns) {
        return false;
    }
    return startpoints - calcScoreOfTurns(turns) === 0;
}
