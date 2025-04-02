import { PlayerState } from "@/app/domain/dart-game";

export function PlayerBadge({ state }: { state: PlayerState; }) {
    const badgeColor = getColorByState(state);
    return (
        <div className={`w-[24px] h-full ${badgeColor}`} />
    );
}

function getColorByState(state: PlayerState) {
    switch (state) {
        case "overthrown":
            return "bg-red-400"
        case "won":
            return "bg-gray-300"
        case "playing":
            return "bg-primary"
        default:
            return "bg-gray-200";
    }
}