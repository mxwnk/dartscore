import { repository } from "@/app/db/repository";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target } from "lucide-react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

export async function EventLog({ gameId }: { gameId: string }) {
    const events = await repository.getEvents(gameId);
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    className="fixed cursor-pointer bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg transition-all"
                    aria-label="Open Dialog"
                >
                    <Target className="h-6 w-6" />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Eventlog</DialogTitle>
                <Table>
      <TableCaption>Eine Liste von Benutzern.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rolle</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="font-medium">{event.id}</TableCell>
            <TableCell>{event.type}</TableCell>
            <TableCell>{JSON.stringify(event.payload)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

            </DialogContent>
        </Dialog>
    )
}