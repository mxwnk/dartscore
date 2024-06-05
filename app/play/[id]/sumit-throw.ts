'use server';
import { revalidateTag } from "next/cache";
import { DartGame, DartThrow } from "@/app/domain/dart-game";
import { getGameById } from "@/app/db/actions";

export async function submitThrow(gameId: string, dartThrow: DartThrow) {
    const game = DartGame.fromGameState(await getGameById(gameId));
    await game.throwDart(dartThrow);
    revalidateTag(`/play/${gameId}`);
}
