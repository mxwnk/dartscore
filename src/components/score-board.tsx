import { Grid, Typography, Button } from "@mui/material";
import { useState } from "react";
import { useGlobalKeydown } from "../hooks/global-keydown";
import { Ring } from "../models/ring";
import { caseInsensitiveEquals } from "../utils/string";
import { Throw } from "../models/throw";

const scores = [...Array.from(Array(21).keys()), 25];

type ScoreboardProps = {
  onAddThrow: (t: Throw) => void
};

export function Scoreboard(props: ScoreboardProps) {
  const [ring, setRing] = useState<Ring | undefined>()
  const toggleRing = (ring: Ring) => {
    setRing(prev => {
      if (prev === ring) {
        return undefined;
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

  function addThrow(score: number){
    const t: Throw = {score, ring};
    props.onAddThrow(t);
    setRing(undefined);
  }

  return (
    <Grid sx={{ mt: 2 }} container spacing={1}>
      {scores.map(s => (
        <Grid key={s} item xs={2} sx={{ cursor: 'pointer' }} onClick={() => addThrow(s)}>
          <Button sx={{ width: '100%', py: 2 }} variant='outlined'>
            <Typography variant="h4">{s}</Typography>
          </Button>
        </Grid>
      ))}
      <Grid item xs={2}>
        <Button onClick={() => toggleRing("D")} color="info" sx={{ width: '100%', py: 2 }} variant={ring === "D" ? 'contained' : 'outlined'}>
          <Typography variant="h4">Double</Typography>
        </Button>
      </Grid>
      <Grid item xs={2}>
        <Button onClick={() => toggleRing("T")} sx={{ width: '100%', py: 2 }} variant={ring === "T" ? 'contained' : 'outlined'}>
          <Typography variant="h4">Triple</Typography>
        </Button>
      </Grid>
    </Grid>
  )
}