export function PlayerBadge({ selected }: { selected: boolean; }) {
    return (
        <div className={`w-[24px] ${selected ? "bg-primary": "bg-gray-200"}`}>
        </div>
    );
}
