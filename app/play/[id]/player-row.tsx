'use client';
import { PlayerBadge } from "./player-badge";
import { PlayerDto, } from "@/app/models/player";
import { TurnDto, calcTotalScoreOfTurn } from "@/app/models/turn";
import { ThrowDto } from "@/app/models/throw";
import { PlayerState } from "@/app/domain/dart-game";
import { Trophy } from 'lucide-react';

export type PlayerRowProps = {
    player: PlayerDto;
    playerState: PlayerState;
    missingScore: number;
    averageScore: number;
    turn?: TurnDto;
}

export function PlayerRow(props: PlayerRowProps) {
    const hasWon = props.playerState === "won";
    const firstThrow = props.turn?.throws.at(0);
    const secondThrow = props.turn?.throws.at(1);
    const thirdThrow = props.turn?.throws.at(2);

    function rowStyle() {
        switch (props.playerState) {
            case "overthrown":
                return "border-3 border-red-400 bg-red-400 text-white"
            case "won":
                return "bg-gray-300"
            case "playing":
                return "border-primary"
            default:
                return "border-gray-200";
        }
    }

    return (
        <div className={`shadow-md border-3 h-[84px] rounded-sm flex border-solid items-center flex-row justify-between mb-5 pr-4 ${rowStyle()}`}>
            <PlayerBadge selected={props.playerState === 'playing'} />

            <div className="flex flex-col content-center items-center w-48">
                {!hasWon && <h4 className="text-2xl">{props.missingScore}</h4>}
                {hasWon && <Trophy />}
                <h6 className="text-2xl">{props.player.name}</h6>
            </div>

            <div className="text-center w-32">
                <div className="grid gap-1 grid-cols-3 justify-between content-center">
                    <DartThrow throw={firstThrow} />
                    <DartThrow throw={secondThrow} />
                    <DartThrow throw={thirdThrow} />
                </div>
                <h6 className="text-3xl">{calcTotalScoreOfTurn(props.turn)}</h6>
            </div>

            <h5 className="justify-center content-center text-2xl">
                Ø {props.averageScore.toFixed(2)}
            </h5>
        </div>
    );
}

function DartThrow(props: { throw: ThrowDto | undefined }) {
    if (!props.throw) {
        return <></>;
    }
    return (
        <h5 className="text-2xl">{props.throw.ring}{props.throw.score}</h5>
    )
}

