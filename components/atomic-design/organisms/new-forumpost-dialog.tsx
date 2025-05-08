import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ForumPostForm } from "../molecules/forum-post-form";

export function NewForumPostDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Crear una nueva discusión</Button>
            </DialogTrigger>

            <DialogContent className="max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle>Iniciar una nueva discusión</DialogTitle>
                </DialogHeader>
                <ForumPostForm />
            </DialogContent>
        </Dialog>
    )
}