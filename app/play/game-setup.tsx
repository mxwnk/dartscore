'use client';
import { startGame } from "./start-game";
import { AddPlayerDialog } from "./add-player";
import { PlayerWithName } from "./page";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, User, Plus } from 'lucide-react';
import { Checkout } from "@prisma/client";

type GameSetupProps = {
    players: PlayerWithName[];
}

export function GameSetup({ players }: GameSetupProps) {
    const [selectedPlayers, setSelectedPlayers] = useState<PlayerWithName[]>([]);
    const [showAddPlayerDialog, setShowAddPlayerDialog] = useState(false);
    const [startpoints, setStartpoints] = useState<number>(301);
    const [checkout, setCheckout] = useState<Checkout>(Checkout.Straight);

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
                        <h4 className="text-3xl my-4">Starting Points</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                type="button"
                                className="w-full text-2xl cursor-pointer"
                                variant={startpoints === 301 ? "default" : "secondary"}
                                onClick={() => setStartpoints(301)}>
                                301
                            </Button>
                            <Button type="button"
                                className="w-full text-2xl cursor-pointer"
                                variant={startpoints === 501 ? "default" : "secondary"}
                                onClick={() => setStartpoints(501)}>
                                501
                            </Button>
                            <input name="startpoints" readOnly type="number" hidden value={startpoints} />
                        </div>
                        <h4 className="text-3xl my-4">Checkout</h4>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <Button type="button" className="w-full text-2xl cursor-pointer"
                                variant={checkout === "Straight" ? "default" : "secondary"}
                                onClick={() => setCheckout("Straight")}>
                                Single
                            </Button>
                            <Button
                                variant={checkout === "Double" ? "default" : "secondary"}
                                type="button" className="w-full text-2xl cursor-pointer" onClick={() => setCheckout("Double")}>
                                Double
                            </Button>
                            <input name="checkout" readOnly type="text" hidden value={checkout} />
                        </div>
                        <h3 className="text-4xl my-8">Players</h3>
                        <Button type="button" className="w-full h-12 text-2xl cursor-pointer" variant="secondary" onClick={() => setShowAddPlayerDialog(true)}>
                            Add Player
                        </Button>
                        {players.map((p, i) => {
                            const selected = selectedPlayers.some(sp => sp.id === p.id);
                            return (
                                <Button onClick={() => togglePlayer(p)}
                                    variant={selected ? "default" : "outline"}
                                    className="my-2 flex flex-row justify-between cursor-pointer"
                                    type="button" key={i}>
                                    <User /> {p.name} {selected ? <CheckIcon /> : <Plus />}
                                </Button>
                            )
                        })}
                    </div>
                    {selectedPlayers.map(p => <input key={p.id} hidden type="text" name="players" defaultValue={p.id} />)}
                    <Button className="mt-8 h-18 text-5xl cursor-pointer" disabled={selectedPlayers.length === 0}
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
