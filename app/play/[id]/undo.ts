"use server";
import { repository } from "@/app/db/repository";
import { gameBroker } from "@/server/game-broker";
import { revalidatePath } from "next/cache";

export async function undoLastThrow(gameId: string) {
  const { version } = await repository.undo(gameId);
  gameBroker.broadcastUpdate(gameId, version);
  revalidatePath(`/play/${gameId}`);
}
