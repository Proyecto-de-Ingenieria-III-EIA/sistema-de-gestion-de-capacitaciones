import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ForumPostForm } from "../molecules/forum-post-form";

export function NewForumPostDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Create new discussion</Button>
            </DialogTrigger>

            <DialogContent className="max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle>Start new discussion</DialogTitle>
                </DialogHeader>
                <ForumPostForm />
            </DialogContent>
        </Dialog>
    )
}