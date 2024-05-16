'use client'

import { Box } from "@mui/material";
import { Navigation } from "./components/app-bar";
import { PlayButton } from "./play-button";

export default function Home() {
  return (
    <>
      <Navigation title="Dart Scoreboard" />
      <Box p={2} display='flex' flexDirection='row'>
          <PlayButton/>
      </Box>
    </>
  );
}


