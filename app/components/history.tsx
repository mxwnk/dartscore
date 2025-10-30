import Link from "next/link";
import { repository } from "../db/repository";
import { TargetIcon } from '../assets/target-icon';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const History = async () => {
    const games = await repository.getHistory();
    return (
        <Card className="inline-block mt-8">
            <h3 className="text-2xl inline-block p-4">Game History</h3>
            <Table className="table-fixed bg-popover">
                <TableHeader>
                    <TableRow>
                        <TableHead className="hidden md:table-cell"></TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Checkout</TableHead>
                        <TableHead>Players</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-center">
                    {games.map(game => (
                        <TableRow key={game.id} className="cursor-pointer">
                            <TableCell className="w-16 p-4 ml-2 hidden md:table-cell">
                                <TargetIcon />
                                <Link href={`/play/${game.id}`} className="absolute inset-0 z-10" />
                            </TableCell>
                            <TableCell className="text-2xl">{game.startpoints}</TableCell>
                            <TableCell>{game.checkout}</TableCell>
                            <TableCell className="flex flex-col p-2 text-left">
                                {game.players.map(player => (
                                    <p key={player.name}>{player.legsWon} {player.name}</p>
                                ))}
                            </TableCell>
                            <TableCell className="px-2">{game.createdAt.toLocaleDateString("de-DE", { day: '2-digit', month: '2-digit', year: '2-digit' })}</TableCell>
                            <TableCell className="px-2">{game.createdAt.toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' })}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};