import Link from "next/link";
import { repository } from "../db/repository";
import { TargetIcon } from '../assets/target-icon';
import { Card } from "@/components/ui/card";

export const History = async () => {
    const games = await repository.getHistory();
    return (
        <Card className="inline-block mt-8">
            <h3 className="text-2xl inline-block p-4">Game History</h3>
            <table className="table-fixed bg-popover">
                <thead className="bg-">
                    <tr className="[&>th]:p-4 text-xs">
                        <th className="hidden md:table-cell"></th>
                        <th>Points</th>
                        <th>Checkout</th>
                        <th>Players</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th className="hidden md:table-cell"></th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {games.map(game => (
                        <tr key={game.id}>
                            <td className="w-16 p-4 ml-2 hidden md:table-cell"><TargetIcon /></td>
                            <td className="text-2xl">{game.startpoints}</td>
                            <td>{game.checkout}</td>
                            <td className="flex flex-col p-2 text-left">
                                {game.players.map(player => (
                                    <p key={player.name}>{player.legsWon} {player.name}</p>
                                ))}
                            </td>
                            <td className="px-2">{game.createdAt.toLocaleDateString("de-DE", { day: '2-digit', month: '2-digit', year: '2-digit' })}</td>
                            <td className="px-2">{game.createdAt.toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' })}</td>
                            <td className="px-4 hidden md:table-cell">
                                <Link className="text-primary cursor-pointer underline" href={`/play/${game.id}`}>Open</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
};