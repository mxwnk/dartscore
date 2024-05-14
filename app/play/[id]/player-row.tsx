import { Box, Grid, Paper, Typography } from "@mui/material";
import { PlayerBadge } from "./player-badge";
import { PlayerDto, getCurrentTurnOfPlayer } from "@/app/models/player";
import { calcAverageOfTurns, calcTotalScoreOfTurn, calcTotalScoreOfTurns } from "@/app/models/turn";
import { ThrowDto } from "@/app/models/throw";

export function PlayerRow({ player, isPlaying }: { player: PlayerDto; isPlaying: boolean; }) {
    const currentTurn = getCurrentTurnOfPlayer(player);
    const style = currentTurn?.overthrown ? {backgroundColor: "#f48fb1", color: '#ffffff'} : {};
    return (
        <Paper elevation={2} sx={{ display: 'flex', mb: 2, ...style}}>
            <PlayerBadge selected={isPlaying} />
            <Grid container justifyContent='space-between'>
                <Grid item xs={4} alignContent='center' alignItems='center'>
                    <Box textAlign='center'>
                        <Typography variant='h4'>{301 - calcTotalScoreOfTurns(player.turns)}</Typography>
                        <Typography variant='h6'>{player.name}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={4} textAlign='center'>
                    {currentTurn?.throws?.length > 0 &&
                        <>
                            <Grid container spacing={2} justifyContent='space-between'>
                                <Grid item xs={4}>
                                    <Score throw={currentTurn?.throws[0]} />
                                </Grid>
                                <Grid item xs={4}>
                                    <Score throw={currentTurn?.throws[1]} />
                                </Grid>
                                <Grid item xs={4}>
                                    <Score throw={currentTurn?.throws[2]} />
                                </Grid>
                            </Grid>
                            <Typography variant='h6'>{calcTotalScoreOfTurn(currentTurn)}</Typography>
                        </>
                    }
                </Grid>
                <Grid item xs={4} justifyContent='center' alignContent='center'>
                    <Typography variant='h4' textAlign='center'>
                        Ø{calcAverageOfTurns(player.turns)}
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
