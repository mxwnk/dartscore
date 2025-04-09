import { Scoreboard } from "@/app/play/[id]/score-board";
import { PlayerRow } from "./player-row";
import { Navigation } from "@/app/components/app-bar";
import { RoundBanner } from "./turn-banner";
import { repository } from "@/app/db/repository";
import { EventLog } from "./event-log";

export default async function Game(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const gameId = params.id;
    const gameProjection = await repository.getProjection(gameId);
    const gameView = gameProjection.toView();

    return (
        <>
            <Navigation title={`Game: ${gameView.players.length} Player - ${gameView.startpoints} Points - ${gameView.checkout} Out`} />
            <div className="mt-4 px-2 max-w-[1800px] mx-auto">
                {gameView.players.map((p, i) => <PlayerRow
                    key={i}
                    state={p.state}
                    name={p.name}
                    remaining={p.remaining}
                    average={p.average}
                    turn={p.currentTurn}
                />)}
                <RoundBanner remaining={gameView.round.remaining} round={gameView.round.number} />
                <Scoreboard gameId={gameId} />
            </div>
            <EventLog gameId={gameId} />
        </>
    );
}