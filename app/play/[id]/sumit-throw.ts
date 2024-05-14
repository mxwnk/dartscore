'use server';
import prisma from "@/lib/prisma";
import { RingDto, TurnDto, getCurrentPlayer } from "@/app/models/game";
import { getGameById } from "../get-game";
import { revalidateTag } from "next/cache";

export async function submitThrow(turn: TurnDto, dartThrow: { ring: RingDto | null, score: number }) {
    const updatedTurn = await prisma.turn.update({
        where: { id: turn.id },
        data: { throws: { create: dartThrow } },
        select: { throws: true, gameId: true }
    });
    if (updatedTurn.throws.length === 3) {
        await nextTurn(updatedTurn.gameId);
    }

    revalidateTag(`/game/${turn.gameId}`);
}

async function nextTurn(gameId: string){
        const game = await getGameById(gameId);
        const currentPlayer = getCurrentPlayer(game);
        const currentPlayerIndex = game.players.findIndex(p => p.id === currentPlayer.id);
        const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;
        const nextPlayer = game.players[nextPlayerIndex];
        await prisma.turn.create({
            data: {
                gameId: game.id,
                playerId: nextPlayer.id
            }
        });
}