import prisma from "@/lib/prisma";
import { Button, Checkbox, List, ListItem, ListItemButton, ListItemText, MenuItem, Paper, Select, Typography } from "@mui/material";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function getPlayers() {
    return await prisma.player.findMany();
}

export default async function SetupPage() {
    async function startGame(formData: FormData) {
        'use server'
        const playerIds = formData.getAll("players") as string[];
        const players = await prisma.player.findMany({ where: { id: { in: playerIds } } })
        const game = await prisma.game.create({ data: { players: { connect: players } } });
        revalidatePath('/setup');
        redirect(`game/${game.id}`);
    }
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