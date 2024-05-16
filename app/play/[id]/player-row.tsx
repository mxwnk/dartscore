'use client';
import { Box, Grid, Paper, Typography, useTheme } from "@mui/material";
import { PlayerBadge } from "./player-badge";
import { PlayerDto, getCurrentTurnOfPlayer, hasPlayerWon } from "@/app/models/player";
import { calcAverageOfTurns, calcTotalScoreOfTurn, calcTotalScoreOfTurns } from "@/app/models/turn";
import { ThrowDto } from "@/app/models/throw";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export function PlayerRow({ player, isPlaying, startpoints }: { player: PlayerDto; isPlaying: boolean; startpoints: number; }) {
    const theme = useTheme();
    const currentTurn = getCurrentTurnOfPlayer(player);
    const hasWon = hasPlayerWon(player, startpoints);

    function rowStyle() {
        if (hasWon) {
            return { backgroundColor: theme.palette.grey[200] };
        }
        if (currentTurn?.overthrown) {
            return { backgroundColor: "#f48fb1", color: '#ffffff' };
        }
        return {};
    }

    return (
        <Paper elevation={2} sx={{ display: 'flex', mb: 2, border: isPlaying ? `2px solid ${theme.palette.primary.main}` : "", ...rowStyle()}}>
            <PlayerBadge selected={isPlaying} />
            <Grid container justifyContent='space-between'>
                <Grid item xs={4} alignContent='center' alignItems='center'>
                    <Box textAlign='center'>
                        {!hasWon && <Typography variant='h4'>{startpoints - calcTotalScoreOfTurns(player.turns)}</Typography>}
                        {hasWon && <EmojiEventsIcon />}
                        <Typography variant='h6'>{player.name}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={4} textAlign='center'>
                    {currentTurn?.throws?.length > 0 &&
                        <>
                            <Grid container spacing={2} justifyContent='space-between' alignContent='center'>
                                <Grid item xs={4}>
                                    <DartThrow throw={currentTurn?.throws[0]} />
                                </Grid>
                                <Grid item xs={4}>
                                    <DartThrow throw={currentTurn?.throws[1]} />
                                </Grid>
                                <Grid item xs={4}>
                                    <DartThrow throw={currentTurn?.throws[2]} />
                                </Grid>
                            </Grid>
                            <Typography variant='h6'>{calcTotalScoreOfTurn(currentTurn)}</Typography>
                        </>
                    }
                </Grid>
                <Grid item xs={4} justifyContent='center' alignContent='center'>
                    <Typography variant='h5' textAlign='center'>
                        Ø{calcAverageOfTurns(player.turns)}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
}

function DartThrow(props: { throw: ThrowDto | undefined }) {
    if (!props.throw) {
        return <></>;
    }
    return (
        <Typography variant='h5'>{props.throw.ring}{props.throw.score}</Typography>
    )
}

