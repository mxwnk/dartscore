'use client';
import { startGame } from "./start-game";
import { AddPlayerDialog } from "./add-player";
import { PlayerWithName } from "./page";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, User, Plus } from 'lucide-react';

type GameSetupProps = {
    players: PlayerWithName[];
}

export function GameSetup({ players }: GameSetupProps) {
    const [selectedPlayers, setSelectedPlayers] = useState<PlayerWithName[]>([]);
    const [showAddPlayerDialog, setShowAddPlayerDialog] = useState(false);

    function togglePlayer(player: PlayerWithName) {
        if (selectedPlayers.some(sp => sp.id === player.id)) {
            setSelectedPlayers(prev => prev.filter(p => p.id !== player.id));
        } else {
            setSelectedPlayers(prev => [...prev, player]);
        }
    }

    return (
        <>
            <form action={startGame}>
                <div className="flex flex-col items-stretch mx-auto max-w-[1024px] p-2">
                    <h2 className="text-6xl text-center">Game Setup</h2>
                    <div className="grid items-stretch">
                        <h3 className="text-4xl my-4">Game Mode</h3>

                        <h3 className="text-4xl my-4">Players</h3>
                        <Button type="button" className="w-full h-12 text-2xl" variant="secondary" onClick={() => setShowAddPlayerDialog(true)}>
                            Add Player
                        </Button>
                        {players.map((p, i) => {
                            const selected = selectedPlayers.some(sp => sp.id === p.id);
                            return (
                                <Button onClick={() => togglePlayer(p)}
                                    variant={selected ? "default" : "outline"}
                                    className="my-2 flex flex-row justify-between"
                                    type="button" key={i}>
                                    <User /> {p.name} {selected ? <CheckIcon /> : <Plus />}
                                </Button>
                            )
                        })}
                    </div>
                    {selectedPlayers.map(p => <input key={p.id} hidden type="text" name="players" defaultValue={p.id} />)}
                    <Button className="mt-8 h-18 text-5xl" disabled={selectedPlayers.length === 0}
                        type="submit"
                        variant="default">
                        Start Game
                    </Button>
                </div >
            </form>
            <AddPlayerDialog
                showDialog={showAddPlayerDialog}
                close={() => setShowAddPlayerDialog(false)}
            />
        </>
    );
}
