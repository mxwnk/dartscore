'use server';

import prisma from "@/lib/prisma";
import { getGameById } from "../get-game";
import { revalidateTag } from "next/cache";

export async function undoLastThrow(gameId: string) {
    const game = await getGameById(gameId);
    const throws = game.turns.flatMap(t => t.throws);
    const lastThrow = throws[throws.length - 1];
    if (!lastThrow) {
        return;
    }
    const lastTurn = game.turns[game.turns.length - 1];
    if (lastTurn.throws.length === 0) {
        await prisma.turn.delete({ where: { id: lastTurn.id } });
    }
    await prisma.throw.delete({ where: { id: lastThrow.id } });
    revalidateTag(`/game/${gameId}`);
}