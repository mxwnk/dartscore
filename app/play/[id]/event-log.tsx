import { repository } from "@/app/db/repository";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target } from "lucide-react";
import {
  Table,
  TableBody,
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
      <DialogContent className="min-w-[80vw]">
        <DialogTitle>Eventlog</DialogTitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Payload</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
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