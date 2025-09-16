import { describe, expect, it } from 'vitest'
import { GameProjection } from '@/app/domain/projection';
import { dartThrownEvent, gameCreatedEvent, gameStartedEvent, playerAddedEvent, turnStartedEvent } from '@/app/domain/events';
import { startGame } from '../seeder/game.seed';

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
            playerAddedEvent({ payload: { name: "Homer", id: "1", position: 0 }, gameId }),
            playerAddedEvent({ payload: { name: "Bart", id: "1", position: 1 }, gameId }),
            gameStartedEvent({ gameId }),
            turnStartedEvent({ gameId, createdBy: "system", payload: { playerId: "1" } }),
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
            turnStartedEvent({ gameId, createdBy: "system", payload: { playerId: "2" } }),
        ];
        const projection = GameProjection.from(events)

        const view = projection.toView();

        expect(view.players[0].average).toBe(6);
        expect(view.players[0].remaining).toBe(295);
        expect(view.players[0].state).toBe("waiting");
        expect(view.players[0].currentTurn?.total).toBe(6);
        expect(view.players[0].currentTurn?.darts).toEqual([
            { score: 1, ring: undefined },
            { score: 1, ring: "D" },
            { score: 1, ring: "T" },
        ]);
    });

    it("should display current player", async () => {
        const events = [
            ...twoPlayerGameSetup(),
            dartThrownEvent({ gameId, payload: { score: 1, playerId: "1", overthrown: false, ring: undefined } }),
            dartThrownEvent({ gameId, payload: { score: 1, playerId: "1", overthrown: false, ring: "D" } }),
            dartThrownEvent({ gameId, payload: { score: 1, playerId: "1", overthrown: false, ring: "T" } }),
            turnStartedEvent({ gameId, createdBy: "system", payload: { playerId: "2" } }),
        ];
        const projection = GameProjection.from(events)

        const view = projection.toView();

        expect(view.players[1].state).toBe("playing");
        expect(view.round).toEqual({ number: 1, remaining: 301 });
    });

    it("should mark current winner", async () => {
        const events = [
            gameCreatedEvent({ gameId, startpoints: 1, checkout }),
            playerAddedEvent({ payload: { name: "Homer", id: "1", position: 0 }, gameId }),
            turnStartedEvent({ gameId, createdBy: "system", payload: { playerId: "1" } }),
            dartThrownEvent({ gameId, payload: { score: 1, playerId: "1", overthrown: false, ring: undefined } }),
        ];
        const projection = GameProjection.from(events)

        const view = projection.toView();

        expect(view.players[0].state).toBe("won");
    });

    function twoPlayerGameSetup() {
        return [
            gameCreatedEvent({ gameId, startpoints, checkout }),
            playerAddedEvent({ payload: { name: "Homer", id: "1", position: 0 }, gameId }),
            playerAddedEvent({ payload: { name: "Bart", id: "2", position: 1 }, gameId }),
            gameStartedEvent({ gameId }),
            turnStartedEvent({ gameId, createdBy: "system", payload: { playerId: "1" } }),
        ];
    }
});

