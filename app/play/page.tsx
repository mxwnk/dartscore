import prisma from "@/lib/prisma";
import { Button, Typography } from "@mui/material";
import { startGame } from "./start-game";

async function getPlayers() {
    return await prisma.player.findMany();
}

export default async function SetupPage() {
    const players = await getPlayers();
    return (
        <form action={startGame}>
            <Typography variant="h3">Start new Game</Typography>
            <Typography variant="h5">Select players</Typography>
            <div>
                <select name="players" multiple>
                    {players.map((p, i) => (
                        <option key={i} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </div>
            <Button type="submit" color="primary" variant='contained'>Start Game</Button>
        </form>
    );
}