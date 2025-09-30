import { PlayerState } from "@/app/models/player";

export function PlayerBadge({ state }: { state: PlayerState; }) {
    const badgeColor = getColorByState(state);
    return (
        <div className={`w-[24px] h-full ${badgeColor}`} />
    );
}

function getColorByState(state: PlayerState) {
    switch (state) {
        case "overthrown":
            return "bg-red-300"
        case "won":
            return "bg-black-80"
        case "playing":
            return "bg-primary"
        default:
            return "bg-black-80";
    }
}