import { submitPlayer } from "./submit-player";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AddPlayerDialog({ showDialog, close }: { showDialog: boolean, close: () => void }) {
    const onSubmit = async (formData: FormData) => {
        console.log("submit");
        await submitPlayer(formData);
        close();
    }
    return (
        <Dialog open={showDialog}>
            <DialogContent>
                <form action={onSubmit} className="my-4">
                    <DialogHeader>
                        <DialogTitle>Add new player</DialogTitle>
                    </DialogHeader>
                    <Input maxLength={16} autoFocus placeholder="Name" name="name" />
                    <DialogFooter>
                        <Button variant="outline" onClick={close}>Cancel</Button>
                        <Button type="submit">Add</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
