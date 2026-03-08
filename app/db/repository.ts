import { DomainEvent } from "../domain/events";
import { Game } from "../domain/game";
import { GameHistory } from "../domain/gameHistory";
import { GameProjection } from "../domain/projection";
import { Stats } from "../models/statistics";
import { PrismaRepository } from "./prisma.repository";

export type Repository = {
  getEvents(gameId: string): Promise<DomainEvent[]>;
  getHistory(): Promise<GameHistory[]>;
  getProjection(gameId: string): Promise<GameProjection>;
  getStats(): Promise<Stats>

  load(gameId: string): Promise<Game>;
  save(game: Game): Promise<{ version: number }>;
  undo(gameId: string): Promise<{ version: number }>;
};

export const repository = PrismaRepository.instance();
