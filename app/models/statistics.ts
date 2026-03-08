export type Stats = {
    players: PlayerStats[]
}

export type PlayerStats = {
    id: string;
    name: string;
    legsWon: number;
    gamesWon: number;
    highestCheckout: number;
    highestTurn: number;
}