import { DomainEvent } from "../domain/events";
import { Game } from "../domain/game";
import { GameHistory } from "../domain/gameHistory";
import { GameProjection } from "../domain/projection";
import { PrismaRepository } from "./prisma.repository";

export type Repository = {
  getHistory(): Promise<GameHistory[]>;
  save(game: Game): Promise<{ version: number }>;
  load(gameId: string): Promise<Game>;
  getProjection(gameId: string): Promise<GameProjection>;
  undo(gameId: string): Promise<{ version: number }>;
  getEvents(gameId: string): Promise<DomainEvent[]>;
};

export const repository = PrismaRepository.instance();
