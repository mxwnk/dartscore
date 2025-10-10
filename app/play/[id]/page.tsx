import { repository } from "@/app/db/repository";
import { GameSynchronizer } from "./game-synchronizer";
import { Game } from "./game";
import { Navigation } from "@/app/components/app-bar";
import { ViewMode, ViewSelector } from "./view-selector";
import { Spectator } from "./spectator";
import { InviteButton } from "@/app/components/invite-button";
import { EventLog } from "@/app/components/event-log";
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function Page(props: { params: Promise<{ id: string }>, searchParams: Promise<{ view?: ViewMode }> }) {
  const params = await props.params;
  const gameId = params.id;
  const gameProjection = await repository.getProjection(gameId);
  const gameView = gameProjection.toView();

  return (
    <GameSynchronizer gameId={gameId} version={gameView.version}>
      <SidebarProvider defaultOpen={false} >
        <div className="flex flex-col h-full w-full">
          <Navigation
            title={`${gameView.setup.startpoints} Points - ${gameView.setup.legs} Legs - ${gameView.setup.checkout} Out`}
            end={<><InviteButton /><SidebarTrigger className="ml-2" /></>}
          />
          <main>
            <Sidebar className="mt-17" side="right" variant="sidebar">
              <SidebarContent className="p-4 bg-black-80">
                <EventLog gameId={gameId} players={gameView.players} />
              </SidebarContent>
            </Sidebar>
            <ViewSelector
              gameId={gameId}
              spectator={<Spectator gameView={gameView} />}
              play={<Game gameId={gameId} gameView={gameView} />}
            />
          </main>
        </div>
      </SidebarProvider>
    </GameSynchronizer >
  );
}
