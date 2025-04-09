'use server';
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Game } from "../domain/game";
import { Checkout } from "../models/checkout";
import { repository } from "../db/repository";

export async function startGame(formData: FormData) {
    const playerIds = formData.getAll("players") as string[];
    const checkout = formData.get("checkout") as Checkout;
    const startpoints = parseInt(formData.get("startpoints")?.toString() as string) as number;
    const players = await prisma.player.findMany({ where: { id: { in: playerIds } } })
    const game = Game.start({checkout, startpoints});
    players.forEach(p => game.addPlayer(p));
    await repository.save(game);
    revalidatePath('/setup');
    redirect(`/play/${game.getId()}`);
}