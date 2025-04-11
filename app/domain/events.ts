import { createId } from "@paralleldrive/cuid2"
import { GameEvent } from "@prisma/client"
import { Ring } from "../models/ring";
import { Checkout } from "../models/checkout";
import { PlayerWithPositon } from "../models/player";

export type DomainEvent = GameEvent;

export type DartThrown = DomainEvent & {
    type: "DartThrown",
    payload: {
        playerId: string,
        score: number,
        ring?: Ring,
        overthrown: boolean
    }
}

export function dartThrownEvent({ payload, gameId }: { payload: DartThrown["payload"], gameId: string }): DartThrown {
    return {
        id: createId(),
        type: "DartThrown",
        gameId,
        payload,
        createdAt: new Date(),
    }
}

export type GameCreated = DomainEvent & {
    type: "GameCreated",
    payload: {
        startpoints: number,
        checkout: Checkout
    }
}

export function gameCreatedEvent({ gameId, startpoints, checkout }: { gameId: string, startpoints: number, checkout: Checkout }): GameCreated {
    return {
        id: createId(),
        type: "GameCreated",
        gameId,
        createdAt: new Date(),
        payload: {
            startpoints,
            checkout
        },
    }
}

export type PlayerAdded = DomainEvent & {
    type: "PlayerAdded",
    payload: PlayerWithPositon
}

export function playerAddedEvent({ payload, gameId }: { payload: PlayerAdded["payload"], gameId: string }): PlayerAdded {
    return {
        id: createId(),
        createdAt: new Date(),
        type: "PlayerAdded",
        gameId,
        payload
    }
}