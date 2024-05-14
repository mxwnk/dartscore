import prisma from "@/lib/prisma";

export async function getGameById(id: string) {
    'use server';
    return await prisma.game.findUniqueOrThrow({
        where: { id },
        include: {
            turns: {
                include: {
                    throws: true,
                    player: true
                },
                where: {
                    gameId: id
                }
            },
            players: {
                include: {
                    turns: {
                        include: {
                            throws: true
                        },
                        where: {
                            gameId: id
                        }
                    }
                }
            }
        }
    });
}