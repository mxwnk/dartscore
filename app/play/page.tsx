export const dynamic = 'force-dynamic';

import prisma from "@/lib/prisma";
import { Navigation } from "../components/app-bar";
import { GameSetup } from "./game-setup";
import { Box } from "@mui/material";

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export type PlayerWithName = ThenArg<ReturnType<typeof getPlayers>>[0];

async function getPlayers() {
    return await prisma.player.findMany();
}

export default async function PlayPage() {
    const players = await getPlayers();
    return (
        <Box>
            <Navigation title="Play Darts" />
            <GameSetup players={players} />
        </Box>
    );
}