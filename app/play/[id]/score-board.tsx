'use client';
import { Grid, Typography, Button } from "@mui/material";
import { useState } from "react";
import { useGlobalKeydown } from "../../hooks/global-keydown";
import { caseInsensitiveEquals } from "../../utils/string";
import { submitThrow } from "@/app/play/[id]/sumit-throw";
import { undoLastThrow } from "./undo";
import { RingDto } from "@/app/models/ring";
import { TurnDto } from "@/app/models/turn";

const scores = [...Array.from(Array(21).keys()), 25];

type ScoreboardProps = {
  turn: TurnDto;
};

export function Scoreboard(props: ScoreboardProps) {
  const [ring, setRing] = useState<RingDto | null>(null);
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
    setRing(null);
    if (score === 25 && ring === "T") {
      return;
    }
    await submitThrow(props.turn, { score, ring });
  }

  return (
    <>
      <Grid sx={{ mb: 2 }} container spacing={1}>
        {scores.map(s => (
          <Grid key={s} item xs={2} sx={{ cursor: 'pointer' }} onClick={() => onSumit(s)}>
            <Button sx={{ width: '100%', py: 2 }} variant='outlined'>
              <Typography variant="h4">{s}</Typography>
            </Button>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={1}>
        <Grid item md={4} lg={4} xs={6}>
          <Button onClick={() => toggleRing("D")} color="info" sx={{ width: '100%', py: 2 }} variant={ring === "D" ? 'contained' : 'outlined'}>
            <Typography variant="h4">Double</Typography>
          </Button>
        </Grid>
        <Grid item md={4} lg={4} xs={6}>
          <Button onClick={() => toggleRing("T")} sx={{ width: '100%', py: 2 }} variant={ring === "T" ? 'contained' : 'outlined'}>
            <Typography variant="h4">Triple</Typography>
          </Button>
        </Grid>
        <Grid item md={4} lg={4} xs={6}>
          <Button onClick={() => undoLastThrow(props.turn.gameId)} color="error" sx={{ width: '100%', py: 2 }} variant='outlined'>
            <Typography variant="h4">Undo</Typography>
          </Button>
        </Grid>
      </Grid>
    </>
  )
}