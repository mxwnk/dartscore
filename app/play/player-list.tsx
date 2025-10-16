import { Button } from '@/components/ui/button';
import { DndContext, closestCenter, DragEndEvent, useSensor, MouseSensor, TouchSensor, useSensors } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CheckIcon, MoveVertical, Plus, User } from 'lucide-react';
import { PlayerWithName } from './page';

type PlayerListProps = {
    players: PlayerWithName[];
    selectedIds: string[];
    onTogglePlayer: (player: PlayerWithName) => void;
    onReorder: (players: PlayerWithName[]) => void;
};

export default function PlayerList({ players, selectedIds, onTogglePlayer, onReorder }: PlayerListProps) {
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
      );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = players.findIndex((p) => p.id === active.id);
        const newIndex = players.findIndex((p) => p.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;
        onReorder(arrayMove(players, oldIndex, newIndex));
    }

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
            <SortableContext items={players.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                {players.map((p) => (
                    <SortablePlayer
                        key={p.id}
                        player={p}
                        selected={selectedIds.includes(p.id)}
                        togglePlayer={onTogglePlayer}
                    />
                ))}
            </SortableContext>
        </DndContext>
    );
}

export type DraggablePlayerProps = {
    player: PlayerWithName;
    selected: boolean;
    togglePlayer: (player: PlayerWithName) => void;
};

function SortablePlayer({ player, selected, togglePlayer }: DraggablePlayerProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: player.id,
        transition: {
            duration: 42,
            easing: 'ease-in-out',
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: "all 0.05s ease-in-out",
        touchAction: 'none',
    } as React.CSSProperties;

    return (
        <Button
            onClick={() => togglePlayer(player)}
            style={style}
            ref={setNodeRef}
            variant={selected ? "secondary" : "ghost"}
            {...listeners}
            {...attributes}
            className={`my-2 flex flex-row justify-between cursor-pointer border-1 border-input`}
            type="button"
        >
            {selected ? <MoveVertical /> : <User />} {player.name}{' '}
            {selected ? <CheckIcon className="text-primary" /> : <Plus />}
        </Button>
    );
}
