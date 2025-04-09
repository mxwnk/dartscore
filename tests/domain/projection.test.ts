import { describe, expect, it } from 'vitest'
import { GameProjection } from '@/app/domain/projection';
import { dartThrownEvent, gameCreatedEvent, playerAddedEvent } from '@/app/domain/events';

describe("Game Projection", () => {
    const gameId = "42";
    const startpoints = 301;
    const checkout = "Straight";

    it("should allow to create a new game", async () => {
        const events = [gameCreatedEvent({ gameId, startpoints, checkout })];
        const projection = GameProjection.from(events)

        const view = projection.toView();

        expect(view.gameId).toBe("42");
    });

    it("should represent all players", async () => {
        const events = [
            gameCreatedEvent({ gameId, startpoints, checkout }),
            playerAddedEvent({ name: "Homer", playerId: "1", gameId }),
            playerAddedEvent({ name: "Bart", playerId: "1", gameId })
        ];
        const projection = GameProjection.from(events)

        const view = projection.toView();

        expect(view.players.length).toBe(2);
    });
    
    it("should represent current turn", async () => {
        const events = [
            ...twoPlayerGameSetup(),
            dartThrownEvent({ gameId, payload: { score: 1, playerId: "1", overthrown: false, ring: undefined } }),
            dartThrownEvent({ gameId, payload: { score: 1, playerId: "1", overthrown: false, ring: "D" } }),
            dartThrownEvent({ gameId, payload: { score: 1, playerId: "1", overthrown: false, ring: "T" } }),
        ];
        const projection = GameProjection.from(events)

        const view = projection.toView();

        expect(view.players[0].average).toBe(6);
        expect(view.players[0].remaining).toBe(295);
        expect(view.players[0].hasWon).toBe(false);
        expect(view.players[0].currentTurn.total).toBe(6);
        expect(view.players[0].currentTurn.darts).toEqual([
            { score: 1, ring: undefined },
            { score: 1, ring: "D"},
            { score: 1, ring: "T"},
        ]);
    });

    it("should mark current winner", async () => {
        const events = [
            gameCreatedEvent({ gameId, startingPoints: 1, checkout }),
            playerAddedEvent({ name: "Homer", playerId: "1", gameId }),
            dartThrownEvent({ gameId, payload: { score: 1, playerId: "1", overthrown: false, ring: undefined } }),
        ];
        const projection = GameProjection.from(events)

        const view = projection.toView();

        expect(view.players[0].hasWon).toBe(true);
    });

    function twoPlayerGameSetup() {
        return [
            gameCreatedEvent({ gameId, startingPoints, checkout }),
            playerAddedEvent({ name: "Homer", playerId: "1", gameId }),
            playerAddedEvent({ name: "Bart", playerId: "2", gameId })
        ];
    }
});

