import { TurnDto } from "./turn";

export type ThrowDto = TurnDto["throws"]["0"];

export function calcScoreOfThrow(t: ThrowDto) {
    if (t.ring === "D") {
        return t.score * 2;
    }
    if (t.ring === "T") {
        return t.score * 3;
    }
    return t.score;
}