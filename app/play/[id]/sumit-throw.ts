'use server';
import prisma from "@/lib/prisma";
import { GameDto, getCurrentPlayer } from "@/app/models/game";
import { revalidateTag } from "next/cache";
import { TurnDto } from "@/app/models/turn";
import { PlayerDto, hasPlayerWon } from "@/app/models/player";
import { ThenArg } from "@/app/utils/promise";
import { DartGame, DartThrow } from "@/app/domain/dart-game";
import { getGameById } from "@/app/db/actions";


export async function submitThrow(gameId: string, dartThrow: DartThrow) {
    const game = DartGame.fromGameState(await getGameById(gameId));
    await game.throwDart(dartThrow);
    revalidateTag(`/play/${gameId}`);
}

function isNextTurn(currentTurn: CurrentTurn) {
    return currentTurn.throws.length === 3 || currentTurn.overthrown || hasPlayerWon(currentTurn.player, currentTurn.game.startpoints)
}

async function nextTurn(gameId: string) {
    const game = await getGameById(gameId);
    const currentPlayer = getCurrentPlayer(game);
    const nextPlayer = getNextPlayer(currentPlayer.id, game);

    if (!nextPlayer) {
        return;
    }
    await prisma.turn.create({
        data: {
            gameId: game.id,
            playerId: nextPlayer.id,
            overthrown: false
        }
    });
}

function getNextPlayer(currentPlayerId: string, game: GameDto): PlayerDto | undefined {
    const currentPlayerIndex = game.players.findIndex(p => p.id === currentPlayerId);
    for (let index = 1; index <= game.players.length + 1; index++) {
        const nextPlayerIndex = (currentPlayerIndex + index) % game.players.length;
        const nextPlayer = game.players[nextPlayerIndex];
        if (!hasPlayerWon(nextPlayer, game.startpoints)) {
            return nextPlayer;
        }
    }
    return undefined;
}

export type CurrentTurn = ThenArg<ReturnType<typeof addThrowToTurn>>

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
                    id: true,
                    name: true,
                    turns: {
                        select: { id: true, gameId: true, throws: true, overthrown: true, playerId: true, },
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
                    id: true,
                    name: true,
                    turns: {
                        select: { id: true, gameId: true, throws: true, overthrown: true, playerId: true },
                        where: { gameId: turn.gameId }
                    }
                }
            }
        }
    });
}
