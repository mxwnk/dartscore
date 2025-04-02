'use client';
import { useState } from "react";
import { useGlobalKeydown } from "../../hooks/global-keydown";
import { caseInsensitiveEquals } from "../../utils/string";
import { submitThrow } from "@/app/play/[id]/sumit-throw";
import { undoLastThrow } from "./undo";
import { RingDto } from "@/app/models/ring";
import { Button } from "@/components/ui/button";

const scores = [...Array.from(Array(21).keys()), 25];

type ScoreboardProps = {
  gameId: string;
};

export function Scoreboard(props: ScoreboardProps) {
  const [ring, setRing] = useState<RingDto | null>(null);
  const [disabled, setDisabled] = useState(false);
  const toggleRing = (ring: RingDto) => {
    setRing(prev => {
      if (prev === ring) {
        return null;
      }
      return ring;
    });
  }

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
    await submitThrow(props.gameId, { score, ring });
    setRing(null);
    setDisabled(false);
  }

  return (
    <>
      <div className="mb-4 grid gap-1 grid-cols-6">
        {scores.map(s => (
          <Button onClick={() => onSumit(s)}
            key={s}
            className="py-8 w-[100%] text-2xl cursor-pointer"
            disabled={s === 25 && ring === "T"}
            variant="secondary">
            {s}
          </Button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-1">
        <Button className="w-[100%] h-18 py-4 text-4xl cursor-pointer" onClick={() => toggleRing("D")} color="info"
          variant={ring === "D" ? 'default' : 'secondary'}
        >
          Double
        </Button>
        <Button className="w-[100%] h-18 py-4 text-4xl cursor-pointer" onClick={() => toggleRing("T")} color="info"
          variant={ring === "T" ? 'default' : 'secondary'}>
          Triple
        </Button>
        <Button className="w-[100%] bg-red-400 h-18 py-4 text-4xl cursor-pointer" onClick={() => undoLastThrow(props.gameId)}
          variant="destructive">
          Undo
        </Button>
      </div>
    </>
  )
}