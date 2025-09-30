import { submitPlayer } from "./submit-player";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AddPlayerDialog({ showDialog, close }: { showDialog: boolean, close: () => void }) {
    const onSubmit = async (formData: FormData) => {
        await submitPlayer(formData);
        close();
    }
    return (
        <Dialog open={showDialog} onOpenChange={close}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add new player</DialogTitle>
                </DialogHeader>
                <form action={onSubmit} className="my-4">
                    <Input className="mb-8" type="text" maxLength={16} autoFocus placeholder="Name" name="name" />
                    <DialogFooter>
                        <Button className="cursor-pointer" type="button" variant="outline" onClick={close}>Cancel</Button>
                        <Button className="cursor-pointer" type="submit">Add</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
