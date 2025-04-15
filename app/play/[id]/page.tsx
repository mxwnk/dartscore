import { repository } from "@/app/db/repository";
import { GameSynchronizer } from "./game-synchronizer";
import { Game } from "./game";
import { Navigation } from "@/app/components/app-bar";
import { ViewSelector } from "./view-selector";
import { Spectator } from "./spectator";
import { InviteButton } from "@/app/components/invite-button";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const gameId = params.id;
  const gameProjection = await repository.getProjection(gameId);
  const gameView = gameProjection.toView();

  return (
    <GameSynchronizer gameId={gameId} version={gameView.version}>
      <Navigation
        title={`Game: ${gameView.players.length} Player - ${gameView.startpoints} Points - ${gameView.checkout} Out`}
        end={<InviteButton />}
      />
      <ViewSelector
        spectator={<Spectator gameView={gameView} />}
        player={<Game gameId={gameId} gameView={gameView} />}
      />
    </GameSynchronizer>
  );
}
