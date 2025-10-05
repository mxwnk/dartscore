"use server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Game } from "../domain/game";
import { Checkout } from "../models/checkout";
import { repository } from "../db/repository";

export async function startGame(formData: FormData) {
  const playerIds = formData.getAll("players") as string[];
  const checkout = formData.get("checkout") as Checkout;
  const startpoints = parseInt(
    formData.get("startpoints")?.toString() as string,
  ) as number;
  const players = await prisma.player.findMany({
    where: { id: { in: playerIds } },
  });
  const legs = parseInt(formData.get("legs")?.toString() as string) as number;
  const playerMap = new Map(players.map((p) => [p.id, p]));
  const orderedPlayers = playerIds.map((id) => playerMap.get(id)!);
  const game = Game.create({ checkout, startpoints, legs });
  orderedPlayers.forEach((p) => game.addPlayer(p));
  game.start();
  await repository.save(game);
  redirect(`/play/${game.getId()}`);
}
