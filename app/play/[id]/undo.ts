'use server';
import { getGameById } from "@/app/db/actions";
import { DartGame } from "@/app/domain/dart-game";
import { revalidateTag } from "next/cache";

export async function undoLastThrow(gameId: string) {
    const game = DartGame.fromGameState(await getGameById(gameId));
    await game.undo();
    revalidateTag(`/game/${gameId}`);
}