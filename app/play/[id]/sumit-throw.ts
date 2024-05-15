'use server';
import prisma from "@/lib/prisma";
import { getCurrentPlayer } from "@/app/models/game";
import { getGameById } from "../get-game";
import { revalidateTag } from "next/cache";
import { TurnDto, calcTotalScoreOfTurns } from "@/app/models/turn";
import { RingDto } from "@/app/models/ring";
import { redirect } from "next/navigation";

type CreateThrow = {
    ring: RingDto | null;
    score: number;
}

export async function submitThrow(turn: TurnDto, dartThrow: CreateThrow) {
    let updatedTurn = await addThrowToTurn(turn, dartThrow);
    const totalScore = calcTotalScoreOfTurns(updatedTurn.player.turns);
    const startpoints = updatedTurn.game.startpoints;
    if (totalScore === startpoints) {
        redirect(`/game/${turn.gameId}/finished`);
    } else if (totalScore > startpoints) {
        updatedTurn = await setOverthrown(updatedTurn);
    }

    if (updatedTurn.throws.length === 3 || updatedTurn.overthrown) {
        await nextTurn(updatedTurn.gameId);
    }

    revalidateTag(`/game/${turn.gameId}`);
}

async function nextTurn(gameId: string) {
    const game = await getGameById(gameId);
    const currentPlayer = getCurrentPlayer(game);
    const currentPlayerIndex = game.players.findIndex(p => p.id === currentPlayer.id);
    const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;
    const nextPlayer = game.players[nextPlayerIndex];
    await prisma.turn.create({
        data: {
            gameId: game.id,
            playerId: nextPlayer.id,
            overthrown: false
        }
    });
}

async function addThrowToTurn(turn: TurnDto, dartThrow: CreateThrow) {
    const updatedTurn = await prisma.turn.update({
        where: { id: turn.id },
        data: { throws: { create: dartThrow } },
        select: {
            id: true,
            throws: true,
            gameId: true,
            overthrown: true,
            game: {
                select: {
                    startpoints: true
                }
            },
            player: {
                select:
                {
                    turns: {
                        select: { id: true, throws: true, overthrown: true },
                        where: { gameId: turn.gameId }
                    }
                }
            }
        }
    });
    return updatedTurn;
}

async function setOverthrown(turn: Omit<TurnDto, "playerId">) {
    return await prisma.turn.update({
        where: { id: turn.id }, data: {
            overthrown: true
        },
        select: {
            id: true,
            throws: true,
            gameId: true,
            overthrown: true,
            game: {
                select: {
                    startpoints: true
                }
            },
            player: {
                select:
                {
                    turns: {
                        select: { id: true, throws: true, overthrown: true },
                        where: { gameId: turn.gameId }
                    }
                }
            }
        }
    });
}
