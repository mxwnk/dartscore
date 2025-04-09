'use server';
import { repository } from "@/app/db/repository";
import { Dart } from "@/app/models/dart";
import { revalidateTag } from "next/cache";

export async function submitDart(gameId: string, dart: Dart) {
    const game = await repository.load(gameId);
    game.throwDart(dart);
    await repository.save(game);
    revalidateTag(`/play/${gameId}`);
}
