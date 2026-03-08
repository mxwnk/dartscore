"use server";
import { repository } from "@/app/db/repository";
import { Dart } from "@/app/models/dart";
import { gameBroker } from "@/server/game-broker";
import { revalidatePath } from "next/cache";

export async function submitDart(gameId: string, dart: Dart) {
  const game = await repository.load(gameId);
  game.throwDart(dart);
  const update = await repository.save(game);
  gameBroker.broadcastUpdate(gameId, update.version);
  revalidatePath(`/play/${gameId}`);
}
