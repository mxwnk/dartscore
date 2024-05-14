import { calcAverage, calcCurrentScore, calcTotalScore, getThrowOfTurn } from "@/src/models/player";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { PlayerBadge } from "./player-badge";
import { PlayerDto, ThrowDto } from "@/app/models/game";

export function PlayerRow({ player, isPlaying }: { player: PlayerDto; isPlaying: boolean; }) {
    return (
        <Paper elevation={2} sx={{ display: 'flex', mb: 2 }}>
            <PlayerBadge selected={isPlaying} />
            <Grid container justifyContent='space-between'>
                <Grid item xs={4} alignContent='center' alignItems='center'>
                    <Box textAlign='center'>
                        <Typography variant='h4'>{301 - calcTotalScore(player)}</Typography>
                        <Typography variant='h6'>{player.name}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={4} textAlign='center'>
                    <Grid container spacing={2} justifyContent='space-between'>
                        <Grid item xs={4}>
                            <Score throw={getThrowOfTurn(player, 0)} />
                        </Grid>
                        <Grid item xs={4}>
                            <Score throw={getThrowOfTurn(player, 1)} />
                        </Grid>
                        <Grid item xs={4}>
                            <Score throw={getThrowOfTurn(player, 2)} />
                        </Grid>
                    </Grid>
                    <Typography variant='h6'>{calcCurrentScore(player)}</Typography>
                </Grid>
                <Grid item xs={4} justifyContent='center' alignContent='center'>
                    <Typography variant='h4' textAlign='center'>
                        Ø{calcAverage(player)}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
}

function Score(props: { throw: ThrowDto | undefined }) {
    if (!props.throw) {
        return <></>;
    }
    return (
        <Typography variant='h4'>{props.throw.ring}{props.throw.score}</Typography>
    )
}
