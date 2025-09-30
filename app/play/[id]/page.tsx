import { repository } from "@/app/db/repository";
import { GameSynchronizer } from "./game-synchronizer";
import { Game } from "./game";
import { Navigation } from "@/app/components/app-bar";
import { ViewSelector } from "./view-selector";
import { Spectator } from "./spectator";
import { InviteButton } from "@/app/components/invite-button";
import { EventLog } from "@/app/components/event-log";
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger, SidebarHeader } from "@/components/ui/sidebar";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const gameId = params.id;
  const gameProjection = await repository.getProjection(gameId);
  const gameView = gameProjection.toView();

  return (
    <GameSynchronizer gameId={gameId} version={gameView.version}>
      <SidebarProvider defaultOpen={false} >
        <div className="flex flex-col h-full w-full">
          <Navigation
            title={`Game: ${gameView.players.length} Player - ${gameView.startpoints} Points - ${gameView.checkout} Out`}
            end={<><InviteButton /><SidebarTrigger className="ml-2" /></>}
          />
          <main>
            <Sidebar className="mt-17" side="right" variant="sidebar">
              <SidebarContent className="p-4 bg-black-80">
                <EventLog gameId={gameId} players={gameView.players} />
              </SidebarContent>
            </Sidebar>
            <ViewSelector
              spectator={<Spectator gameView={gameView} />}
              player={<Game gameId={gameId} gameView={gameView} />}
            />
          </main>
        </div>
      </SidebarProvider>
    </GameSynchronizer >
  );
}
