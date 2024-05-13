'use client'
import { createId } from "@paralleldrive/cuid2";
import { Button, Typography, TextField, Box, Paper, Grid, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { Throw } from "@/src/models/throw";
import { Player, addThrowToPlayer, calcAverage, calcCurrentScore, calcTotalScore, getCurrentTurn, getThrowOfTurn } from "@/src/models/player";
import { Scoreboard } from "@/src/components/score-board";

export default function Home() {
  const theme = useTheme();
  const [nameField, setNameField] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [current, setCurrent] = useState<Player>();

  useEffect(() => {
    if (current) {
      return;
    }
    setCurrent(players[0]);
  }, [players, setCurrent, current]);

  useEffect(() => {
    const index = players.findIndex(p => p.name == current?.name);
    if (index === -1) {
      return;
    }
    const currentTurn = getCurrentTurn(players[index]);
    if (!currentTurn || currentTurn.throws?.length < 3) {
      return;
    }
    const nextPlayer = (index + 1) % players.length;
    setCurrent(players[nextPlayer]);
  }, [players]);

  const addPlayer = (p: Player) => {
    setPlayers(prev => [...prev, p]);
  }

  const addThrow = (t: Throw) => {
    const index = players.findIndex(p => p.name == current?.name);
    if (index === -1) {
      return;
    }
    setPlayers(prev => {
      addThrowToPlayer(prev[index], t);
      return structuredClone(prev);
    });
  }

  const onKeyDown = (e: { key: string }) => {
    if (e.key === "Enter") {
      createPlayer(nameField);
      return;
    }
  }

  function createPlayer(name: string) {
    addPlayer({ id: createId(), name: nameField, turns: [] });

  }

  return (
    <div>
      <Typography variant="h1">Dart Scoreboard</Typography>
      <Box sx={{ display: "flex" }}>
        <TextField onKeyDown={onKeyDown} onChange={(e) => setNameField(e.target.value)} ></TextField>
        <Button onClick={() => createPlayer(nameField)} variant="contained">Add</Button>
      </Box>
      <Box mt={2}>
        {players.map((p, i) => (
          <Paper key={i} elevation={2} sx={{ display: 'flex', mb: 2 }}>
            <Box width='24px' bgcolor={current?.name === p.name ? theme.palette.primary.main : theme.palette.grey[400]}></Box>
            <Grid container justifyContent='space-between'>
              <Grid item xs={4}>
                <Box textAlign='center'>
                  <Typography variant='h3'>{301 - calcTotalScore(p)}</Typography>
                  <Typography variant='h6'>{p.name}</Typography>
                </Box>
              </Grid>
              <Grid item xs={4} textAlign='center'>
                <Grid container spacing={2} justifyContent='space-between'>
                  <Grid item xs={4}>
                    <Score throw={getThrowOfTurn(p, 0)} />
                  </Grid>
                  <Grid item xs={4}>
                    <Score throw={getThrowOfTurn(p, 1)} />
                  </Grid>
                  <Grid item xs={4}>
                    <Score throw={getThrowOfTurn(p, 2)} />
                  </Grid>
                </Grid>
                <Typography variant='h6'>{calcCurrentScore(p)}</Typography>
              </Grid>
              <Grid item xs={4} justifyContent='center' alignContent='center'>
                <Typography variant='h3' textAlign='center'>
                  Ø{calcAverage(p)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>
      <Scoreboard onAddThrow={addThrow} />
    </div>
  );
}

function Score(props: { throw: Throw | undefined }) {
  if (!props.throw) {
    return <></>;
  }
  return (
    <Typography variant='h3'>{props.throw.ring}{props.throw.score}</Typography>
  )
}
