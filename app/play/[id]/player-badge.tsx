'use client';
import { Box, useTheme } from "@mui/material";

export function PlayerBadge({ selected }: { selected: boolean; }) {
    const theme = useTheme();
    return (
        <Box width='24px'
             bgcolor={selected ? theme.palette.primary.main : theme.palette.grey[400]}>
        </Box>
    );
}
