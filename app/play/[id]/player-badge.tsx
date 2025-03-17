export function PlayerBadge({ selected }: { selected: boolean; }) {
    return (
        <div className={`w-[24px] h-full ${selected ? "bg-primary" : "bg-gray-200"}`} />
    );
}
