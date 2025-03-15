import { Scoreboard } from "@/app/play/[id]/score-board";
import { PlayerRow } from "./player-row";
import { Navigation } from "@/app/components/app-bar";
import { DartGame } from "@/app/domain/dart-game";
import { getGameById } from "@/app/db/actions";
import { TurnBanner } from "./turn-banner";

export default async function Game(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const game = DartGame.fromGameState(await getGameById(params.id));
    const currentPlayer = game.getCurrentPlayer();

    return (
        <>
            <Navigation title={`In Game: ${game.getPlayers().length} Player - ${game.getStartPoints()} Points`} />
            <div className="mt-4 px-2">
                {game.getPlayers().map((p, i) => <PlayerRow
                    key={i}
                    player={p}
                    playerState={game.getPlayerState(p.id)}
                    missingScore={game.getMissingScore(p.id)}
                    averageScore={game.getAverageScore(p.id)}
                    turn={game.getCurrentTurn(p.id)}
                />)}
                {currentPlayer && <TurnBanner missingScore={game.getMissingScore(currentPlayer.id)} rounds={game.getRounds()} />}
                {currentPlayer && <Scoreboard gameId={game.getId()} playerId={currentPlayer.id} />}
            </div>
        </>
    );
}