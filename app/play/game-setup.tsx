"use client";
import { startGame } from "./start-game";
import { AddPlayerDialog } from "./add-player";
import { PlayerWithName } from "./page";
import { useEffect, useState } from "react";
import PlayerList from "./player-list";
import { Button } from "@/components/ui/button";
import { Checkout } from "../models/checkout";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
      <Card className="flex flex-col items-stretch mt-4 max-w-[1024px] p-4 mx-auto">
        <h2 className="text-3xl text-center">Game Setup</h2>
        <div className="grid items-stretch">
          <h3 className="text-3xl my-4">Starting Points</h3>
          <ToggleGroup value={startpoints.toString()} onValueChange={v => setStartpoints(parseInt(v))} className="w-full" type="single">
            {gameStartPoints.map((sp) => (
              <ToggleGroupItem variant="outline" key={sp} size="lg" className="w-full text-2xl cursor-pointer" value={sp.toString()}>{sp}</ToggleGroupItem>
            ))}
          </ToggleGroup>
          <input
            name="startpoints"
            readOnly
            type="number"
            hidden
            value={startpoints}
          />
          <h3 className="text-3xl my-4">Checkout</h3>
          <ToggleGroup value={checkout} onValueChange={c => setCheckout(c as Checkout)} className="w-full" type="single">
            {checkouts.map((c) => (
              <ToggleGroupItem variant="outline" key={c} size="lg" className="w-full text-2xl cursor-pointer" value={c}>{c}</ToggleGroupItem>
            ))}
          </ToggleGroup>
          <input
            name="checkout"
            readOnly
            type="text"
            hidden
            value={checkout}
          />
          <h3 className="text-3xl my-4">Legs</h3>
          <ToggleGroup value={legs.toString()} onValueChange={(v) => setLegs(parseInt(v))} className="w-full" type="single">
            {possibleLegs.map((l) => (
              <ToggleGroupItem variant="outline" key={l} size="lg" className="w-full text-2xl cursor-pointer" value={l.toString()}>{l}</ToggleGroupItem>
            ))}
          </ToggleGroup>
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
      </Card>
      <AddPlayerDialog
        showDialog={showAddPlayerDialog}
        close={() => setShowAddPlayerDialog(false)}
      />
    </form>
  );
}
