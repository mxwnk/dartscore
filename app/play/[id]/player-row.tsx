'use client';
import { Box, Grid, Paper, Typography, useTheme } from "@mui/material";
import { PlayerBadge } from "./player-badge";
import { PlayerDto, } from "@/app/models/player";
import { TurnDto, calcTotalScoreOfTurn } from "@/app/models/turn";
import { ThrowDto } from "@/app/models/throw";
import { PlayerState } from "@/app/domain/dart-game";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';


export type PlayerRowProps = {
    player: PlayerDto;
    playerState: PlayerState;
    missingScore: number;
    averageScore: number;
    turn?: TurnDto;
}

export function PlayerRow(props: PlayerRowProps) {
    const theme = useTheme();
    const hasWon = props.playerState === "won";
    const firstThrow = props.turn?.throws.at(0);
    const secondThrow = props.turn?.throws.at(1);
    const thirdThrow = props.turn?.throws.at(2);

    function rowStyle() {
        switch (props.playerState) {
            case "overthrown":
                return { backgroundColor: "#f48fb1", color: '#ffffff' };
            case "won":
                return { backgroundColor: theme.palette.grey[200] };
            case "playing":
                return { border: `2px solid ${theme.palette.primary.main}` };
            default:
                return {};
        }
    }

    return (
        <Paper elevation={2} sx={{ display: 'flex', mb: 2, ...rowStyle() }}>
            <PlayerBadge selected={props.playerState === 'playing'} />
            <Grid container justifyContent='space-between'>
                <Grid item xs={4} alignContent='center' alignItems='center'>
                    <Box textAlign='center'>
                        {!hasWon && <Typography variant='h4'>{props.missingScore}</Typography>}
                        {hasWon && <EmojiEventsIcon />}
                        <Typography variant='h6'>{props.player.name}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={4} textAlign='center'>
                    <Grid container spacing={2} justifyContent='space-between' alignContent='center'>
                        <Grid item xs={4}>
                            <DartThrow throw={firstThrow} />
                        </Grid>
                        <Grid item xs={4}>
                            <DartThrow throw={secondThrow} />
                        </Grid>
                        <Grid item xs={4}>
                            <DartThrow throw={thirdThrow} />
                        </Grid>
                    </Grid>
                    <Typography variant='h6'>{calcTotalScoreOfTurn(props.turn)}</Typography>
                </Grid>
                <Grid item xs={4} justifyContent='center' alignContent='center'>
                    <Typography variant='h5' textAlign='center'>
                        Ø{props.averageScore.toFixed(2)}
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

