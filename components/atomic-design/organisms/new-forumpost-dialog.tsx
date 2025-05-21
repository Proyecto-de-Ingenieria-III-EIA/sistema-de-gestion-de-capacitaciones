import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ForumPostForm } from "../molecules/forum-post-form";
import { useState } from "react";

export function NewForumPostDialog() {

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Create new discussion</Button>
            </DialogTrigger>

            <DialogContent className="max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle>Start new discussion</DialogTitle>
                </DialogHeader>
                <ForumPostForm onSuccess={() => setOpen(false)}/>
            </DialogContent>
        </Dialog>
    )
}