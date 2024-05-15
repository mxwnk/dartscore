import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';

type NagivationProps = {
    title: string;
}

export function Navigation(props: NagivationProps) {
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    href="/play"
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <ModeStandbyIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {props.title}
                </Typography>
            </Toolbar>
        </AppBar>
    )

}