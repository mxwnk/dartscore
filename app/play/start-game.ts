'use server';
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DartGame } from "../domain/dart-game";
import { redirect } from "next/navigation";

export async function startGame(formData: FormData) {
    const playerIds = formData.getAll("players") as string[];
    const players = await prisma.player.findMany({ where: { id: { in: playerIds } } })
    const game = await DartGame.startNewGame(players);
    revalidatePath('/setup');
    redirect(`/play/${game.id}`);
}