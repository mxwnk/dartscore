import { Scoreboard } from "@/app/play/[id]/score-board";
import { PlayerRow } from "./player-row";
import { Navigation } from "@/app/components/app-bar";
import { Box } from "@mui/material";
import { DartGame } from "@/app/domain/dart-game";
import { getGameById } from "@/app/db/actions";

export default async function Game({ params }: { params: { id: string } }) {
    const game = DartGame.fromGameState(await getGameById(params.id));

    return (
        <>
            <Navigation title={`In Game: ${game.getPlayers().length} Player - ${game.getStartPoints()} Points`} />
            <Box mt={2} px={1}>
                {game.getPlayers().map((p, i) => <PlayerRow
                    key={i}
                    player={p}
                    playerState={game.getPlayerState(p.id)}
                    missingScore={game.getMissingScore(p.id)}
                    averageScore={0}
                    turn={game.getCurrentTurn(p.id)}
                />)}
                {/* <TurnBanner player={game.getCurrentPlayer()} startpoints={game.startpoints} /> */}
                <Scoreboard gameId={game.getId()} /> 
            </Box>
        </>
    );
}
