"use client";
import { PlayerBadge } from "./player-badge";
import { Trophy } from "lucide-react";
import { CurrentTurnView } from "@/app/domain/projection";
import { PlayerState } from "@/app/models/player";
import { Dart } from "@/app/models/dart";
import { DartThrow } from "@/app/components/dart-throw";

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
        return "border-3 border-red-400 bg-red-400 text-white";
      case "won":
        return "border-gray-300 bg-gray-300";
      case "playing":
        return "border-primary";
      case "waiting":
        return "border-gray-200";
    }
  }

  return (
    <div
      className={`shadow-md border-3 rounded-sm grid grid-cols-[24px_1fr_2fr_1fr] border-solid items-center row gap-3 justify-between mb-5 pr-4 ${rowStyle()}`}
    >
      <PlayerBadge state={props.state} />

      <div className="flex flex-col content-center items-center">
        {props.state !== "won" && (
          <h4 className="text-2xl">{props.remaining}</h4>
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
