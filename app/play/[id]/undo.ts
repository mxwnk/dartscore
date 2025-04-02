'use server';
import { deleteThrow, deleteTurn, getGameById, resetOverthrown } from "@/app/db/actions";
import { revalidateTag } from "next/cache";

export async function undoLastThrow(gameId: string) {
    const game = await getGameById(gameId);
    const lastThrow = game.turns.flatMap(t => t.throws).at(-1);
    if (!lastThrow) {
        return;
    }
    await deleteThrow(lastThrow.id);
    await resetOverthrown(lastThrow.turnId);
    const currentTurn = game.turns.at(-1);
    if (currentTurn && lastThrow.turnId !== currentTurn?.id) {
        deleteTurn(currentTurn.id);
    }
    revalidateTag(`/game/${gameId}`);
}