'use client';
import { Button, Dialog, DialogActions, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import { submitPlayer } from "./submit-player";

export function AddPlayerButton() {
    const [showDialog, setShowDialog] = useState(false);
    const onSubmit = async (formData: FormData) => {
        await submitPlayer(formData);
        setShowDialog(false);
    }
    return (
        <>
            <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
                <form action={onSubmit}>
                    <DialogTitle>Add new player</DialogTitle>
                    <TextField autoFocus placeholder="Name" sx={{ p: 2 }} name="name"></TextField>
                    <DialogActions>
                        <Button onClick={() => setShowDialog(false)}>Cancel</Button>
                        <Button variant="contained" type="submit">Add</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Button fullWidth variant='outlined' onClick={() => setShowDialog(prev => !prev)}>
                Add Player
            </Button>
        </>
    )
}
