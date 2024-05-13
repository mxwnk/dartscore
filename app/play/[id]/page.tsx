import prisma from "@/lib/prisma";
import { Scoreboard } from "@/src/components/score-board";
import { calcAverage, calcCurrentScore, calcTotalScore, getThrowOfTurn } from "@/src/models/player";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { Throw } from "@prisma/client";

async function getGame(id: string) {
    return await prisma.game.findUniqueOrThrow({ where: { id }, include: { players: { include: { turns: true } } } });
}

export default async function Game({ params }: { params: { id: string } }) {
    const game = await getGame(params.id);

    return (
        <>
            <Typography variant="h4">Game running</Typography>
            {game.players.map((p, i) => (
                <Paper key={i} elevation={2} sx={{ display: 'flex', mb: 2 }}>
                    {/* <Box width='24px' bgcolor={current?.name === p.name ? theme.palette.primary.main : theme.palette.grey[400]}></Box> */}
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
        </>
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