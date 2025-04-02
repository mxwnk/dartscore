'use server';
import { revalidateTag } from "next/cache";
import { DartGame, DartThrow } from "@/app/domain/dart-game";
import { createNewTurn, getGameById, saveDartThrow, setOverthrown } from "@/app/db/actions";

export async function submitThrow(gameId: string, dartThrow: DartThrow) {
    const gameState = await getGameById(gameId);
    let dartGame = DartGame.fromGameState(gameState);
    const currentTurn = gameState.turns.at(-1);
    if (!currentTurn) {
        return;
    }

    const currentPlayer = dartGame.getCurrentPlayer();
    if (!currentPlayer) {
        return;
    }

    await saveDartThrow({ turnId: currentTurn.id, dartThrow });
    dartGame = DartGame.fromGameState(await getGameById(gameId));
    if (dartGame.getMissingScore(currentPlayer.id) < 0 || dartGame.isWrongCheckout(currentTurn)) {
        await setOverthrown(currentTurn.id);
    }

    dartGame = DartGame.fromGameState(await getGameById(gameId));
    const nextPlayer = dartGame.getNextPlayer();
    if (dartGame.isTurnOver() && nextPlayer) {
        await createNewTurn({ gameId, playerId: nextPlayer.id })
    }
    revalidateTag(`/play/${gameId}`);
}
