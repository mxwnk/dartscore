export type Player = {
    id: string;
    name: string;
}

export type PlayerState = "playing" | "overthrown" | "won" | "waiting";