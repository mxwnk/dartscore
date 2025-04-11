export type Player = {
    id: string;
    name: string;
}

export type PlayerWithPositon = Player & { position: number };

export type PlayerState = "playing" | "overthrown" | "won" | "waiting";