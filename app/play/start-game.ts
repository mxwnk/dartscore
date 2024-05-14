import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function startGame(formData: FormData) {
    'use server'
    const playerIds = formData.getAll("players") as string[];
    const players = await prisma.player.findMany({ where: { id: { in: playerIds } } })
    const game = await prisma.game.create({
        data: {
            players: { connect: players },
            turns: {
                create: {
                    player: { connect: players[0] },
                    overthrown: false
                }
            }
        }
    });
    revalidatePath('/setup');
    redirect(`play/${game.id}`);
}