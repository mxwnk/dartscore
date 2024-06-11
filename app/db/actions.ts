'use server';
import prisma from "@/lib/prisma";
import { PlayerDto } from "../models/player";
import { DartThrow } from "../domain/dart-game";

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

export async function resetOverthrown(turnId: number) {
    return await prisma.turn.update({
        where: {
            id: turnId
        },
        data: { overthrown: false }
    });
}

export async function setOverthrown(turnId: number) {
    return await prisma.turn.update({
        where: {
            id: turnId
        },
        data: { overthrown: true },
        select: {
            id: true,
            overthrown: true,
            playerId: true,
            gameId: true,
            throws: true
        }
    });
}

export async function deleteThrow(throwId: number) {
    return await prisma.throw.delete({ where: { id: throwId } });
}

export async function deleteTurn(turnId: number) {
    return await prisma.turn.delete({ where: { id: turnId } });
}
