'use client';
import { Grid, Typography, Button, Dialog, TextField, DialogActions, DialogTitle } from "@mui/material";
import { useState } from "react";
import { useGlobalKeydown } from "../../hooks/global-keydown";
import { caseInsensitiveEquals } from "../../utils/string";
import { submitThrow } from "@/app/play/[id]/sumit-throw";
import { undoLastThrow } from "./undo";
import { RingDto } from "@/app/models/ring";
import { TurnDto } from "@/app/models/turn";
import { isNumber } from "@/app/utils/number";

const scores = [...Array.from(Array(21).keys()), 25];

type ScoreboardProps = {
  turn: TurnDto;
};

export function Scoreboard(props: ScoreboardProps) {
  const [ring, setRing] = useState<RingDto | null>(null);
  const [scoreField, setScoreField] = useState("");
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
    if (isNumber(key)) {
      setScoreField(prev => prev + key);
      return;
    }
  });

  async function onSumit(score: number) {
    await submitThrow(props.turn, { score, ring });
    setRing(null);
  }

  return (
    <>
      <Dialog open={false} onClose={() => setScoreField("")}>
        <TextField
          value={scoreField}
          onChange={(e) => setScoreField(e.target.value)}
          inputProps={{ maxLength: 3 }}
          type="text"
          autoFocus
          placeholder="Score" sx={{ p: 2 }} name="name">
        </TextField>
      </Dialog>
      <Grid sx={{ mb: 2 }} container spacing={1}>
        {scores.map(s => (
          <Grid key={s} item xs={2}>
            <Button onClick={() => onSumit(s)} disabled={s === 25 && ring === "T"} sx={{ width: '100%', py: 2 }} variant='outlined'>
              <Typography variant="h5">{s}</Typography>
            </Button>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={1}>
        <Grid item md={4} lg={4} xs={6}>
          <Button size="small" onClick={() => toggleRing("D")} color="info" sx={{ width: '100%', py: 2 }} variant={ring === "D" ? 'contained' : 'outlined'}>
            <Typography variant="h5">Double</Typography>
          </Button>
        </Grid>
        <Grid item md={4} lg={4} xs={6}>
          <Button onClick={() => toggleRing("T")} sx={{ width: '100%', py: 2 }} variant={ring === "T" ? 'contained' : 'outlined'}>
            <Typography variant="h5">Triple</Typography>
          </Button>
        </Grid>
        <Grid item md={4} lg={4} xs={6}>
          <Button onClick={() => undoLastThrow(props.turn.gameId)} color="error" sx={{ width: '100%', py: 2 }} variant='outlined'>
            <Typography variant="h5">Undo</Typography>
          </Button>
        </Grid>
      </Grid>
    </>
  )
}