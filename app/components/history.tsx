import Link from "next/link";
import { repository } from "../db/repository";
import { TargetIcon } from '../assets/target-icon';

export const History = async () => {
    const games = await repository.getHistory();
    return (
        <div className="inline-block bg-black-80 rounded-lg mt-8 shadow-xl shadow-black">
            <h3 className="text-2xl inline-block p-4">Game History</h3>
            <table className="table-fixed">
                <thead className="bg-black">
                    <tr className="bg-black [&>th]:p-4 text-sm">
                        <th></th>
                        <th>Points</th>
                        <th>Checkout</th>
                        <th>Players</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {games.map(game => (
                        <tr key={game.id}>
                            <td className="w-16 p-4 ml-2"><TargetIcon /></td>
                            <td className="text-2xl">{game.startpoints}</td>
                            <td>{game.checkout}</td>
                            <td className="flex flex-col p-2 text-left">
                                {game.players.map(player => (
                                    <p key={player.name}>{player.legsWon} {player.name}</p>
                                ))}
                            </td>
                            <td className="px-2">{game.createdAt.toLocaleDateString()}</td>
                            <td className="px-2">{game.createdAt.toLocaleTimeString()}</td>
                            <td className="px-4">
                                <Link className="text-primary cursor-pointer underline" href={`/play/${game.id}`}>View</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};