"use client";
import { startGame } from "./start-game";
import { AddPlayerDialog } from "./add-player";
import { PlayerWithName } from "./page";
import { useEffect, useState } from "react";
import PlayerList from "./player-list";
import { Button } from "@/components/ui/button";
import { Checkout } from "../models/checkout";
import { ButtonGroup } from "@/components/ui/button-group";

type GameSetupProps = {
  players: PlayerWithName[];
};

const gameStartPoints = [301, 501];
const checkouts: Checkout[] = ["Straight", "Double"];
const possibleLegs: number[] = Array.from({ length: 9 }, (_, i) => i + 1).filter(l => l % 2 === 1);

export function GameSetup({ players: playerList }: GameSetupProps) {
  const [players, setPlayers] = useState(playerList);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [showAddPlayerDialog, setShowAddPlayerDialog] = useState(false);
  const [startpoints, setStartpoints] = useState<number>(301);
  const [checkout, setCheckout] = useState<Checkout>("Straight");
  const [legs, setLegs] = useState<number>(possibleLegs[1]);

  useEffect(() => {
    setPlayers(playerList);
  }, [playerList]);

  function togglePlayer(player: PlayerWithName) {
    if (selectedPlayerIds.some((id) => id === player.id)) {
      setSelectedPlayerIds((prev) => prev.filter((id) => id !== player.id));
    } else {
      setSelectedPlayerIds((prev) => [...prev, player.id]);
    }
  }

  function onReorder(newOrder: PlayerWithName[]) {
    setPlayers(newOrder);
  }

  return (
    <form action={startGame} className="p-4 rounded-xl">
      <div className="flex flex-col items-stretch rounded-xl mt-4 max-w-[1024px] p-2 bg-popover p-4 mx-auto">
        <h2 className="text-3xl text-center">Game Setup</h2>
        <div className="grid items-stretch">
          <h3 className="text-3xl my-4">Starting Points</h3>
          <div className="grid grid-cols-2 gap-2">
            {gameStartPoints.map((sp) => (
              <Button
                key={sp}
                type="button"
                className="w-full text-2xl cursor-pointer"
                variant={startpoints === sp ? "secondary" : "outline"}
                onClick={() => setStartpoints(sp)}
              >
                {sp}
              </Button>
            ))}
            <input
              name="startpoints"
              readOnly
              type="number"
              hidden
              value={startpoints}
            />
          </div>
          <h3 className="text-3xl my-4">Checkout</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {checkouts.map((c) => (
              <Button
                key={c}
                type="button"
                className="w-full text-2xl cursor-pointer"
                variant={checkout === c ? "secondary" : "outline"}
                onClick={() => setCheckout(c)}
              >
                {c}
              </Button>
            ))}
            <input
              name="checkout"
              readOnly
              type="text"
              hidden
              value={checkout}
            />
          </div>
          <h3 className="text-3xl my-4">Legs</h3>
          <ButtonGroup className="flex w-full">
            {possibleLegs.map((l) => (
              <Button
                key={l}
                type="button"
                className="cursor-pointer text-2xl flex-1"
                variant={legs === l ? "secondary" : "outline"}
                onClick={() => setLegs(l)}
              >
                {l}
              </Button>
            ))}
          </ButtonGroup>
          <input
            name="legs"
            readOnly
            type="number"
            hidden
            value={legs}
          />
          <h3 className="text-3xl my-8">Players</h3>
          <Button
            type="button"
            className="w-full h-12 text-2xl cursor-pointer mb-4"
            variant="outline"
            onClick={() => setShowAddPlayerDialog(true)}
          >
            Create Player
          </Button>
          <PlayerList
            players={players}
            selectedIds={selectedPlayerIds}
            onTogglePlayer={togglePlayer}
            onReorder={onReorder}
          />
        </div>
        {players
          .filter((p) => selectedPlayerIds.includes(p.id))
          .map((p) => (
            <input
              key={p.id}
              hidden
              type="text"
              name="players"
              defaultValue={p.id}
            />
          ))}
        <Button
          className={`mt-8 h-18 text-3xl rounded-lg text-white ${selectedPlayerIds.length === 0 ? "cursor-not-allowed" : "cursor-pointer"}`}
          disabled={selectedPlayerIds.length === 0}
          type="submit"
          variant="default"
        >
          Start Game
        </Button>
      </div>
      <AddPlayerDialog
        showDialog={showAddPlayerDialog}
        close={() => setShowAddPlayerDialog(false)}
      />
    </form>
  );
}
