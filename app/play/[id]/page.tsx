import { Scoreboard } from "@/app/play/[id]/score-board";
import { getGameById } from "../get-game";
import { GameDto, isGameOver } from "@/app/models/game";
import { PlayerRow } from "./player-row";
import { TurnBanner } from "./turn-banner";
import { Navigation } from "@/app/components/app-bar";
import { Box } from "@mui/material";

export default async function Game({ params }: { params: { id: string } }) {
    const game: GameDto = await getGameById(params.id);
    const gameOver = isGameOver(game);
    const currentTurn = game.turns[game.turns.length - 1];
    const currentPlayer = game.players.filter(p => p.id === currentTurn.playerId)[0];

    return (
        <>
            <Navigation title={`In Game: ${game.players.length} Player - ${game.startpoints} Points`} />
            <Box mt={2} px={1}>
                {game.players.map((p, i) => <PlayerRow
                    key={i}
                    startpoints={game.startpoints}
                    player={p}
                    isPlaying={!gameOver && currentTurn.playerId === p.id
                    } />)}
                <TurnBanner player={currentPlayer} startpoints={game.startpoints} />
                <Scoreboard turn={currentTurn} />
            </Box>
        </>
    );
}
