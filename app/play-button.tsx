'use client';
import { Button, Paper, Typography, useTheme } from "@mui/material";
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';

export function PlayButton() {
  const theme = useTheme();
  return (
    <Paper elevation={2} sx={{ cursor: 'pointer', bgcolor: theme.palette.primary.dark }}>
      <Button sx={{width: '400px', display: 'flex', flexDirection: 'column'}} href="/play">
        <CrisisAlertIcon sx={{ mt: 3, width: '80%', height: '80%', color: '#fff' }} />
        <Typography color='white' textAlign='center' variant='h3'>Play</Typography>
      </Button>
    </Paper>
  );
}
