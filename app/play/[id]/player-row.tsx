"use client";
import { Trophy } from "lucide-react";
import { CurrentTurnView } from "@/app/domain/projection";
import { PlayerState } from "@/app/models/player";
import { DartThrow } from "@/app/components/dart-throw";
import { Pulse } from "@/app/components/pulse";

export type PlayerRowProps = {
  name: string;
  state: PlayerState;
  remaining: number;
  average: number;
  turn?: CurrentTurnView;
};

export function PlayerRow(props: PlayerRowProps) {
  function rowStyle() {
    switch (props.state) {
      case "overthrown":
        return "border-5 bg-red-300 border-red-300";
      case "won":
        return "border-secondary bg-secondary";
      case "playing":
        return "border-primary bg-popover";
      case "waiting":
        return "border-secondary border-3 bg-popover";
    }
  }

  return (
    <div
      className={`shadow-md border-3 rounded-sm grid grid-cols-[24px_1fr_2fr_1fr] border-solid items-center row gap-3 justify-between mb-5 pr-4 ${rowStyle()}`}
    >
      <PlayerBadge state={props.state} />

      <div className="flex flex-col content-center items-center">
        {props.state !== "won" && (
          <Pulse value={props.remaining} as="h4" className="text-2xl" />
        )}
        {props.state === "won" && <Trophy />}
        <h6 className="text-1xl">{props.name}</h6>
      </div>

      {props.turn && (
        <>
          <div className="text-center grid-grow">
            <div className="grid gap-4 grid-cols-3 justify-between content-center">
              <DartThrow dart={props.turn.darts[0]} />
              <DartThrow dart={props.turn.darts[1]} />
              <DartThrow dart={props.turn.darts[2]} />
            </div>
            <h6 className="text-1xl">{props.turn.total}</h6>
          </div>

          <h5 className="justify-center flex-grow text-center content-center text-2xl">
            Ø {props.average}
          </h5>
        </>
      )}
    </div>
  );
}

function PlayerBadge({ state }: { state: PlayerState; }) {
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
            return "bg-secondary";
    }
}
