import { GameView, PlayerView } from "@/app/domain/projection";
import { RoundBanner } from "./round-banner";
import { DartThrow } from "@/app/components/dart-throw";

export function Spectator({ gameView }: { gameView: GameView }) {
  return (
    <>
      <RoundBanner
        remaining={gameView.round.remaining}
        round={gameView.round.number}
      />
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 w-full">
        {gameView.players.map((p) => (
          <PlayerCard key={p.id} playerView={p} />
        ))}
      </div>
    </>
  );
}

function PlayerCard({ playerView }: { playerView: PlayerView }) {
  function rowStyle() {
    switch (playerView.state) {
      case "overthrown":
        return "border-3 border-red-400 bg-red-400 text-white";
      case "won":
        return "border-gray-300 bg-gray-300";
      case "playing":
        return "border-primary bg-primary text-white";
      case "waiting":
        return "border-gray-200";
    }
  }
  return (
    <div
      className={`shadow-lg p-2 border-3 rounded-md text-center ${rowStyle()}`}
    >
      <h2 className="text-4xl">{playerView.name}</h2>
      <h1 className="text-9xl">{playerView.remaining}</h1>
      <div className="grid gap-4 grid-cols-3 justify-between content-center">
        <DartThrow dart={playerView.currentTurn?.darts[0]} />
        <DartThrow dart={playerView.currentTurn?.darts[1]} />
        <DartThrow dart={playerView.currentTurn?.darts[2]} />
      </div>
      <h6 className="text-1xl">{playerView.currentTurn?.total}</h6>
    </div>
  );
}
