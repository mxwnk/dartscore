import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';

export function Navigation() {
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <ModeStandbyIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Dart Scoreboard
                </Typography>
            </Toolbar>
        </AppBar>
    )

}