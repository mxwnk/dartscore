import { Ring } from "./ring";

export type Dart = {
    score: number;
    ring?: Ring
}

export function calcScore(d?: Dart) {
    if (!d) {
        return 0;
    }
    if (d.ring === "D") {
        return d.score * 2;
    }
    if (d.ring === "T") {
        return d.score * 3;
    }
    return d.score;
}