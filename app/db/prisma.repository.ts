import { Repository } from "./repository";
import prisma from "@/lib/prisma";
import { Game } from "../domain/game";
import { GameEvent, Prisma } from "@prisma/client";
import { GameProjection } from "../domain/projection";
import { DomainEvent } from "../domain/events";

export class PrismaRepository implements Repository {
  public static instance(): Repository {
    return new PrismaRepository();
  }

  public async save(game: Game): Promise<{ version: number }> {
    const events = game.flush();

    if (events.length === 0) return { version: 0 };

    await prisma.gameEvent.createMany({
      data: events.map((e) => ({
        gameId: e.gameId,
        type: e.type,
        payload: e.payload as Prisma.InputJsonValue,
      })),
    });
    return await this.getCurrentVersion(game.getId());
  }

  public async load(gameId: string): Promise<Game> {
    const events = await this.getEvents(gameId);
    return Game.from(events);
  }

  public async getProjection(gameId: string): Promise<GameProjection> {
    const events = await prisma.gameEvent.findMany({
      where: { gameId },
      orderBy: { createdAt: "asc" },
    });

    return GameProjection.from(events);
  }

  public async undo(gameId: string): Promise<{ version: number }> {
    const lastEvent = await prisma.gameEvent.findFirst({
      where: { gameId },
      orderBy: { createdAt: "desc" },
    });
    if (!lastEvent) {
      return { version: 0 };
    }
    await prisma.gameEvent.delete({ where: { id: lastEvent.id } });
    return await this.getCurrentVersion(gameId);
  }

  public async getEvents(gameId: string): Promise<DomainEvent[]> {
    const rows = await prisma.gameEvent.findMany({ where: { gameId } });
    const events: GameEvent[] = rows.map((row) => ({
      id: row.id,
      createdAt: row.createdAt,
      gameId: row.gameId,
      payload: row.payload,
      type: row.type,
    }));
    return events;
  }

  private async getCurrentVersion(
    gameId: string,
  ): Promise<{ version: number }> {
    const version = await prisma.gameEvent.count({
      where: { gameId },
    });
    return { version };
  }
}
