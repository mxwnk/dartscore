import { Scoreboard } from "@/app/play/[id]/score-board";
import { Typography } from "@mui/material";
import { getGameById } from "../get-game";
import { GameDto } from "@/app/models/game";
import { PlayerRow } from "./player-row";

export default async function Game({ params }: { params: { id: string } }) {
    const game: GameDto = await getGameById(params.id);
    const currentTurn = game.turns[game.turns.length - 1];

    return (
        <>
            <Typography variant="h4">Game running</Typography>
            {game.players.map((p, i) => <PlayerRow key={i} player={p} isPlaying={currentTurn.playerId === p.id} />)}
            <Scoreboard turn={currentTurn} />
        </>
    );
}
