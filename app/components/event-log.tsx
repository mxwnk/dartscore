import { repository } from "../db/repository";
import { GameEvent } from "@/prisma/app/generated/prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DartThrown, GameCreated, PlayerAdded, PlayerWon, TurnStarted } from "../domain/events";
import { PlayerView } from "../domain/projection";

export async function EventLog({ gameId, players }: { gameId: string, players: PlayerView[] }) {
    const events = await repository.getEvents(gameId);

    return (
        <div className="my-4 p-4 bg-black-80">
            <h1 className="text-2xl font-bold">Event Log</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead></TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Payload</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {events.map((event) => (
                        <TableRow key={event.id}>
                            <TableCell className="font-medium w-[20px]">{eventType(event.type)}</TableCell>
                            <TableCell className="font-medium w-[50px]">{event.type}</TableCell>
                            <TableCell>{formatPayload(event, players)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

function formatPayload(event: GameEvent, players: PlayerView[]): import("react").ReactNode {
    switch (event.type) {
        case "DartThrown":
            const dartThrownEvent = event as DartThrown;
            return `Score: ${dartThrownEvent.payload.score} ${dartThrownEvent.payload.ring ? "- Ring: " + dartThrownEvent.payload.ring : ""} - Overthrown: ${dartThrownEvent.payload.overthrown}`;
        case "PlayerAdded":
            const playerAddedEvent = event as PlayerAdded;
            return `Player: ${playerAddedEvent.payload.name} - Position: ${playerAddedEvent.payload.position}`;
        case "GameCreated":
            const gameCreatedEvent = event as GameCreated;
            return `Startpoints: ${gameCreatedEvent.payload.startpoints} - Checkout: ${gameCreatedEvent.payload.checkout}`;
        case "TurnStarted":
            const turnStartedEvent = event as TurnStarted;
            return `Player: ${players.find((p) => p.id === turnStartedEvent.payload.playerId)?.name}`;
        case "PlayerWon":
            const playerWonEvent = event as PlayerWon;
            return `Player: ${players.find((p) => p.id === playerWonEvent.payload.playerId)?.name}`;
        case "GameStarted":
            return "Game started";
        default:
            return "Unknown event?";
    }
}

function eventType(type: string): string {
    switch (type) {
        case "DartThrown":
            return "🎯";
        case "PlayerAdded":
            return "👤";
        case "GameCreated":
            return "🕹️";
        case "TurnStarted":
            return "👥";
        case "PlayerWon":
            return "🏆";
        case "GameStarted":
            return "🏁";
        default:
            return type;
    }
}