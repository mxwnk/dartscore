import { createId } from "@paralleldrive/cuid2";
import { Ring } from "../models/ring";
import { Checkout } from "../models/checkout";
import { PlayerWithPositon } from "../models/player";
import { GameEvent } from "@/prisma/app/generated/prisma/client";

export type DomainEvent = GameEvent;

export type PlayerId = {
  playerId: string;
};

export type DartThrown = DomainEvent & {
  type: "DartThrown";
  createdBy: null;
  payload: {
    playerId: string;
    score: number;
    ring?: Ring;
    overthrown: boolean;
  };
};

export function dartThrownEvent({
  payload,
  gameId,
}: {
  payload: DartThrown["payload"];
  gameId: string;
}): DartThrown {
  return {
    id: createId(),
    createdBy: null,
    type: "DartThrown",
    gameId,
    payload,
    createdAt: new Date(),
  };
}

export type GameCreated = DomainEvent & {
  type: "GameCreated";
  createdBy: null;
  payload: {
    startpoints: number;
    checkout: Checkout;
  };
};

export function gameCreatedEvent({
  gameId,
  startpoints,
  checkout,
}: {
  gameId: string;
  startpoints: number;
  checkout: Checkout;
}): GameCreated {
  return {
    id: createId(),
    createdBy: null,
    type: "GameCreated",
    gameId,
    createdAt: new Date(),
    payload: {
      startpoints,
      checkout,
    },
  };
}

export type PlayerAdded = DomainEvent & {
  type: "PlayerAdded";
  payload: PlayerWithPositon;
};

export function playerAddedEvent({
  payload,
  gameId,
}: {
  payload: PlayerAdded["payload"];
  gameId: string;
}): PlayerAdded {
  return {
    id: createId(),
    createdBy: null,
    createdAt: new Date(),
    type: "PlayerAdded",
    gameId,
    payload,
  };
}

export type TurnStarted = DomainEvent & {
  type: "TurnStarted";
  createdBy: string;
  payload: PlayerId;
};

export function turnStartedEvent({
  payload,
  gameId,
  createdBy,
}: {
  payload: PlayerId;
  gameId: string;
  createdBy: string;
}): TurnStarted {
  return {
    id: createId(),
    createdAt: new Date(),
    type: "TurnStarted",
    createdBy,
    gameId,
    payload,
  };
}

export type PlayerWon = DomainEvent & {
  type: "PlayerWon";
  createdBy: string;
  payload: PlayerId;
};

export function playerWonEvent({ gameId, payload, createdBy }: { gameId: string, payload: PlayerId, createdBy: string }): PlayerWon {
  return {
    id: createId(),
    createdAt: new Date(),
    type: "PlayerWon",
    gameId,
    createdBy: createdBy,
    payload: payload,
  };
}

export type GameStarted = DomainEvent & {
  type: "GameStarted";
  createdBy: null;
  payload: null;
};

export function gameStartedEvent({ gameId }: { gameId: string }): GameStarted {
  return {
    id: createId(),
    createdAt: new Date(),
    type: "GameStarted",
    gameId,
    createdBy: null,
    payload: null,
  };
}
