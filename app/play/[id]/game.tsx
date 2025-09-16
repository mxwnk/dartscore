import { GameView } from "@/app/domain/projection";
import { PlayerRow } from "./player-row";
import { RoundBanner } from "./round-banner";
import { Scoreboard } from "./score-board";
import { DevConsole } from "@/app/components/dev-console";

type GameProps = {
  gameId: string;
  gameView: GameView;
};

export function Game({ gameId, gameView }: GameProps) {
  return (
    <>
      {gameView.players
        .sort((a, b) => a.position - b.position)
        .map((p, i) => (
          <PlayerRow
            key={i}
            state={p.state}
            name={p.name}
            remaining={p.remaining}
            average={p.average}
            turn={p.currentTurn}
          />
        ))}
      <RoundBanner
        remaining={gameView.round.remaining}
        round={gameView.round.number}
      />
      <Scoreboard gameId={gameId} />
      <DevConsole gameId={gameId} />
    </>
  );
}
