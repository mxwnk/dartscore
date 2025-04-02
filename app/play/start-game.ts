'use server';
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Checkout } from "@prisma/client";
import { saveNewGame } from "../db/actions";

export async function startGame(formData: FormData) {
    const playerIds = formData.getAll("players") as string[];
    const checkout = formData.get("checkout") as Checkout;
    const startpoints = parseInt(formData.get("startpoints")?.toString() as string) as number;
    const players = await prisma.player.findMany({ where: { id: { in: playerIds } } })
    const game = await saveNewGame({players, startpoints, checkout});
    revalidatePath('/setup');
    redirect(`/play/${game.id}`);
}