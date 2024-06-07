'use server';
import prisma from "@/lib/prisma";
import { PlayerDto } from "../models/player";

export async function getGameById(id: string) {
    return await prisma.game.findUniqueOrThrow({
        where: { id },
        include: {
            turns: {
                include: {
                    throws: true
                }
            },
            players: true
        }
    });
}
export async function saveGame(players: PlayerDto[]) {
    return await prisma.game.create({
        data: {
            players: { connect: players },
            startpoints: 301,
            turns: {
                create: {
                    player: { connect: players[0] },
                    overthrown: false,
                }
            }
        }
    });
}

export async function saveDartThrow({ turnId, dartThrow }: { turnId: number, dartThrow: DartThrow }) {
    return await prisma.throw.create({
        data: {
            turnId,
            score: dartThrow.score,
            ring: dartThrow.ring,
        }
    })
}

export async function createNewTurn({ gameId, playerId }: { gameId: string, playerId: string }) {
    return await prisma.turn.create({
        data: {
            gameId,
            playerId,
            overthrown: false,
        }, select: {
            id: true,
            overthrown: true,
            playerId: true,
            gameId: true,
            throws: true
        }
    });
}