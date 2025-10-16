"use client";
import { useState } from "react";
import { useGlobalKeydown } from "../../hooks/global-keydown";
import { caseInsensitiveEquals } from "../../utils/string";
import { Ring } from "@/app/models/ring";
import { Button } from "@/components/ui/button";
import { submitDart } from "./submit-dart";
import { undoLastThrow } from "./undo";

const scores = [...Array.from(Array(20).keys().map(x => x + 1))];

type ScoreboardProps = {
  gameId: string;
};

export function Scoreboard(props: ScoreboardProps) {
  const [ring, setRing] = useState<Ring | undefined>(undefined);
  const [disabled, setDisabled] = useState(false);
  const toggleRing = (ring: Ring) => {
    setRing((prev) => {
      if (prev === ring) {
        return undefined;
      }
      return ring;
    });
  };

  useGlobalKeydown((e) => {
    const key = e.key.toUpperCase();

    if (caseInsensitiveEquals(key, "T")) {
      toggleRing("T");
      return;
    }
    if (caseInsensitiveEquals(key, "D")) {
      toggleRing("D");
      return;
    }
  });

  async function onSumit(score: number) {
    if (disabled) {
      return;
    }
    setDisabled(true);
    await submitDart(props.gameId, { score, ring });
    setRing(undefined);
    setDisabled(false);
  }

  return (
    <>
      <div className="mb-4 grid gap-1 grid-cols-6">
        {scores.map((s) => (
          <Button
            onClick={() => {
              navigator.vibrate(100);
              onSumit(s);
            }}
            key={s}
            className="py-8 w-[100%] text-2xl cursor-pointer"
            disabled={s === 25 && ring === "T"}
            variant="accent"
          >
            {s}
          </Button>
        ))}
        <Button
          onClick={() => {
            navigator.vibrate(100);
            onSumit(25);
          }}
          key={25}
          className="py-8 col-span-2 w-[100%] text-2xl cursor-pointer"
          disabled={ring === "T"}
          variant="accent"
        >
          25
        </Button>
        <Button
          onClick={() => {
            navigator.vibrate(100);
            onSumit(0);
          }}
          key={0}
          className="py-8 col-span-2 w-[100%] text-2xl cursor-pointer"
          disabled={ring !== undefined}
          variant="accent"
        >
          0
        </Button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-1">
        <Button
          className="w-[100%] h-18 py-4 text-4xl cursor-pointer"
          onClick={() => toggleRing("D")}
          color="info"
          variant={ring === "D" ? "default" : "accent"}
        >
          Double
        </Button>
        <Button
          className="w-[100%] h-18 py-4 text-4xl cursor-pointer"
          onClick={() => toggleRing("T")}
          color="info"
          variant={ring === "T" ? "default" : "accent"}
        >
          Triple
        </Button>
        <Button
          className="w-[100%] h-18 py-4 text-4xl cursor-pointer"
          onClick={() => {
            undoLastThrow(props.gameId);
            navigator.vibrate(100);
          }}
          variant="destructive"
        >
          Undo
        </Button>
      </div>
    </>
  );
}
