import { repository } from "../db/repository";
import { Navigation } from "../components/app-bar";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function Players() {
    const stats = await repository.getStats();
    const sorted = [...stats.players].sort((a, b) => b.legsWon - a.legsWon);
    return (
        <>
        <Navigation title="Players" />
        <div className="p-4 pb-12 mb-12 md:p-4 flex flex-col items-center mx-auto max-w-[500px]">
        <Card className="inline-block w-full">
            <h3 className="text-2xl inline-block p-4">Player Statistics</h3>
            <Table className="table-fixed bg-popover">
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Highest Turn</TableHead>
                        <TableHead>Legs Won</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sorted.map(player => (
                        <TableRow key={player.id}>
                            <TableCell className="px-2">{player.name}</TableCell>
                            <TableCell className="px-2">{player.highestTurn}</TableCell>
                            <TableCell className="px-2">{player.legsWon}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
        </div>
        </>
    )
}