'use server';
import { repository } from "@/app/db/repository";
import { revalidateTag } from "next/cache";

export async function undoLastThrow(gameId: string) {
    await repository.undo(gameId);
    revalidateTag(`/game/${gameId}`);
}