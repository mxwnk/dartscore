'use client';
import { Box, Button, Grid, Typography } from "@mui/material";
import { startGame } from "./start-game";
import { AddPlayerButton } from "./add-player";
import { PlayerWithName } from "./page";
import { useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

type GameSetupProps = {
    players: PlayerWithName[];
}

export function GameSetup({ players }: GameSetupProps) {
    const [selectedPlayers, setSelectedPlayers] = useState<PlayerWithName[]>([]);

    function selectPlayer(player: PlayerWithName) {
        setSelectedPlayers(prev => [...prev, player]);
    }

    function deselectPlayer(player: PlayerWithName) {
        setSelectedPlayers(prev => prev.filter(p => p.id !== player.id));
    }

    return (
        <>
            <form action={startGame}>
                <Box display='flex' marginX='auto' maxWidth='1024px' p={2} flexDirection='column' justifyItems='stretch'>
                    <Typography variant="h2">Game Setup</Typography>
                    <Grid container alignItems='stretch' spacing={2}>
                        <Grid item md={6}>
                            <Typography variant="h4">Available Players</Typography>
                            {players.map((p, i) => {
                                const disabled = selectedPlayers.some(sp => sp.id === p.id);
                                return (
                                    <Button key={i}
                                        fullWidth
                                        disabled={disabled}
                                        variant={disabled ? 'contained' : 'outlined'}
                                        sx={{ cursor: 'pointer', my: 1 }}
                                        onClick={() => selectPlayer(p)}
                                        startIcon={<PersonIcon />}
                                        endIcon={<AddIcon />}>
                                        <Box sx={{ mx: 'auto' }}>
                                            <Typography variant="h5">
                                                {p.name}
                                            </Typography>
                                        </Box>
                                    </Button>
                                )
                            })}
                            <AddPlayerButton></AddPlayerButton>
                        </Grid>
                        <Grid item md={6}>
                            <Typography variant="h4">Selected Players</Typography>
                            {selectedPlayers.map((p, i) => (
                                <>
                                    <Button key={i}
                                        fullWidth
                                        variant='contained'
                                        sx={{ cursor: 'pointer', my: 1 }}
                                        onClick={() => deselectPlayer(p)}
                                        startIcon={<PersonIcon />}
                                        endIcon={<RemoveIcon />}>
                                        <Box sx={{ mx: 'auto' }}>
                                            <Typography variant="h5">
                                                {p.name}
                                            </Typography>
                                        </Box>
                                    </Button>
                                    <input hidden type="text" name="players" value={p.id} />
                                </>
                            ))}
                        </Grid>
                    </Grid>
                    <Button disabled={selectedPlayers.length === 0} sx={{ mt: 8, mx: 'auto', width: '500px' }} type="submit" color="primary" variant='contained'>
                        <Typography variant="h4">Start Game</Typography>
                    </Button>
                </Box>
            </form>
        </>
    );
}
