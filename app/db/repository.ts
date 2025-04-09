import { DomainEvent } from "../domain/events";
import { Game } from "../domain/game";
import { GameProjection } from "../domain/projection";
import { PrismaRepository } from "./prisma.repository";

export type IRepository = {
    save(game: Game): Promise<void>;
    load(gameId: string): Promise<Game>;
    getProjection(gameId: string): Promise<GameProjection>;
    undo(gameId: string): Promise<void>;
    getEvents(gameId: string): Promise<DomainEvent[]>
}

export const repository = PrismaRepository.instance();