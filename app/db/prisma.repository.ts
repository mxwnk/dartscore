import { Repository } from "./repository";
import prisma from "@/lib/prisma";
import { Game } from "../domain/game";
import { GameProjection } from "../domain/projection";
import { DartThrown, DomainEvent, LegWon } from "../domain/events";
import { GameEvent, Prisma } from "@/prisma/app/generated/prisma/client";
import { GameHistory, GameHistoryProjection } from "../domain/gameHistory";
import { Stats } from "../models/statistics";

export class PrismaRepository implements Repository {
  public static instance(): Repository {
    return new PrismaRepository();
  }

  public async getStats(): Promise<Stats> {
    const stats: Stats = { players: [] };
    const players = await prisma.player.findMany({ select: { name: true, id: true } });
    const legsWon: LegWon[] = await prisma.gameEvent.findMany({ where: { type: "LegWon" } }) as unknown as LegWon[];
    const dartsThrown: DartThrown[] = await prisma.gameEvent.findMany({ where: { type: "DartThrown" } }) as unknown as DartThrown[];

    const turnMap = new Map<string, { playerId: string; score: number; overthrown: boolean }>();
    for (const dart of dartsThrown) {
      const { playerId, turnId, score, overthrown } = dart.payload;
      const turn = turnMap.get(turnId) ?? { playerId, score: 0, overthrown: false };
      turn.score += score;
      if (overthrown) turn.overthrown = true;
      turnMap.set(turnId, turn);
    }

    for (const player of players) {
      const playerLegs = legsWon.filter(lw => player.id === lw.payload.winner.playerId).length;
      let highestTurn = 0;
      for (const turn of turnMap.values()) {
        if (turn.playerId === player.id && !turn.overthrown && turn.score > highestTurn) {
          highestTurn = turn.score;
        }
      }
      stats.players.push({ ...player, legsWon: playerLegs, gamesWon: 0, highestCheckout: 0, highestTurn });
    }
    return stats;
  }

  public async getHistory(): Promise<GameHistory[]> {
    const lastGameIds = await prisma.gameEvent.findMany({
      where: {
        type: "GameCreated",
      },
      distinct: ['gameId'],
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { gameId: true },
    });
    const gameIds = lastGameIds.map(game => game.gameId);
    const events = await prisma.gameEvent.findMany({
      where: {
        gameId: { in: gameIds },
        type: { in: ['GameCreated', 'PlayerAdded', "LegWon", "GameOver"] },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    const groupedEvents = events.reduce((acc, ev) => {
      if (!acc[ev.gameId]) {
        acc[ev.gameId] = [];
      }
      acc[ev.gameId].push(ev);
      return acc;
    }, {} as Record<string, typeof events>);
    return Object
      .values(groupedEvents)
      .map(events => GameHistoryProjection.from(events)
        .toView())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public async save(game: Game): Promise<{ version: number }> {
    const events = game.flush();

    if (events.length === 0) return { version: 0 };

    await prisma.gameEvent.createMany({
      data: events.map((e) => ({
        id: e.id,
        gameId: e.gameId,
        createdBy: e.createdBy,
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
      where: { gameId, createdBy: null },
      orderBy: { createdAt: "desc" },
    });
    if (!lastEvent) {
      return { version: 0 };
    }
    await prisma.gameEvent.deleteMany({ where: { createdBy: lastEvent.id } });
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
      createdBy: row.createdBy,
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
