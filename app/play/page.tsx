export const dynamic = 'force-dynamic';

import prisma from "@/lib/prisma";
import { Navigation } from "../components/app-bar";
import { GameSetup } from "./game-setup";

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export type PlayerWithName = ThenArg<ReturnType<typeof getPlayers>>[0];

async function getPlayers() {
    return await prisma.player.findMany();
}

export default async function PlayPage() {
    const players = await getPlayers();
    return (
        <>
            <Navigation title="Play Darts" />
            <GameSetup players={players} />
        </>
    );
}