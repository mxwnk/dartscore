"use client";
import { startGame } from "./start-game";
import { AddPlayerDialog } from "./add-player";
import { PlayerWithName } from "./page";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, User, Plus, MoveVertical } from "lucide-react";
import { Checkout } from "../models/checkout";

type GameSetupProps = {
  players: PlayerWithName[];
};

export function GameSetup({ players: playerList }: GameSetupProps) {
  const [players, setPlayers] = useState(playerList);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [showAddPlayerDialog, setShowAddPlayerDialog] = useState(false);
  const [startpoints, setStartpoints] = useState<number>(301);
  const [checkout, setCheckout] = useState<Checkout>("Straight");

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

  function enableDropping(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
  }

  function onPlayerDrag(event: React.DragEvent<HTMLElement>) {
    event.dataTransfer.setData("playerId", event.currentTarget.id);
    console.log(event.currentTarget.id);
  }

  function onPlayerDrop(event: React.DragEvent<HTMLElement>) {
    const targetId = event.currentTarget.id;
    const sourceId = event.dataTransfer.getData("playerId");
    const targetIndex = players.findIndex((p) => p.id === targetId)!;
    const sourceIndex = players.findIndex((p) => p.id === sourceId)!;
    const target = players[targetIndex];
    const source = players[sourceIndex];
    const newPlayerList = [...players];
    newPlayerList[targetIndex] = source;
    newPlayerList[sourceIndex] = target;
    setPlayers(newPlayerList);
  }

  return (
    <form action={startGame} className="p-4">
      <div className="flex flex-col items-stretch rounded-xl mt-4 max-w-[1024px] p-2 bg-black-80 p-4 mx-auto">
        <h2 className="text-3xl text-center">Game Setup</h2>
        <div className="grid items-stretch">
          <h4 className="text-3xl my-4">Starting Points</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              className="w-full text-2xl cursor-pointer"
              variant={startpoints === 301 ? "outline" : "secondary"}
              onClick={() => setStartpoints(301)}
            >
              301
            </Button>
            <Button
              type="button"
              className="w-full text-2xl cursor-pointer"
              variant={startpoints === 501 ? "outline" : "secondary"}
              onClick={() => setStartpoints(501)}
            >
              501
            </Button>
            <input
              name="startpoints"
              readOnly
              type="number"
              hidden
              value={startpoints}
            />
          </div>
          <h4 className="text-4xl my-4">Checkout</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button
              type="button"
              className="w-full text-2xl cursor-pointer"
              variant={checkout === "Straight" ? "outline" : "secondary"}
              onClick={() => setCheckout("Straight")}
            >
              Single
            </Button>
            <Button
              variant={checkout === "Double" ? "outline" : "secondary"}
              type="button"
              className="w-full text-2xl cursor-pointer"
              onClick={() => setCheckout("Double")}
            >
              Double
            </Button>
            <input
              name="checkout"
              readOnly
              type="text"
              hidden
              value={checkout}
            />
          </div>
          <h3 className="text-4xl my-8">Players</h3>
          <Button
            type="button"
            className="w-full h-12 text-2xl cursor-pointer mb-4"
            variant="secondary"
            onClick={() => setShowAddPlayerDialog(true)}
          >
            Create Player
          </Button>
          {players.map((p, i) => {
            const selected = selectedPlayerIds.some((id) => id === p.id);
            return (
              <Button
                onClick={() => togglePlayer(p)}
                id={p.id}
                variant="ghost"
                draggable
                onDragStart={onPlayerDrag}
                onDragOver={enableDropping}
                onDrop={onPlayerDrop}
                className={`my-2 flex flex-row justify-between cursor-pointer ${selected ? "border-primary border-2" : "bg-background"}`}
                type="button"
                key={i}
              >
                {selected ? <MoveVertical /> : <User />} {p.name}{" "}
                {selected ? <CheckIcon /> : <Plus />}
              </Button>
            );
          })}
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
