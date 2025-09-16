import { isDev } from "@/lib/env";
import { repository } from "../db/repository";

export async function DevConsole({ gameId }: { gameId: string }) {
    const events = await repository.getEvents(gameId);
    if (!isDev) {
        return <></>;
    }
    return (
        <div>
            <h1 className="text-2xl font-bold">DevConsole</h1>
            <table className="w-full border border-gray-300 rounded-md">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Type</th>
                        <th>CreatedBy</th>
                        <th>Payload</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => (
                        <tr key={event.id}>
                            <td>{event.id}</td>
                            <td>{event.type}</td>
                            <td>{event.createdBy}</td>
                            <td>{JSON.stringify(event.payload)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}