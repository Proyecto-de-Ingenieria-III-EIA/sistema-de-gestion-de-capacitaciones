import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { UserAvatar } from "../atoms/user-avatar";
import { MessageCircle } from "lucide-react";
import { ForumPostCardProps } from "@/types/forum-postcard";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { NewCommentDialog } from "../organisms/new-comment-dialog";
import Link from "next/link";
  

export function ForumPostCard({
    id,
    title,
    content,
    author,
    createdAt,
    training,
    commentsCount = 0,
} : ForumPostCardProps) {
    const timeAgo = formatDistanceToNow(new Date(createdAt), {addSuffix: true});

    return (
        <Card className="mb-4 hover:shadow transition-shadow">
            <CardContent className="flex flex-col gap-2 p-4">
                <div className="flex justify-between items-start">
                    <Badge className="bg-purple-200 text-purple-800">{training}</Badge>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <UserAvatar/>
                        <span>{author}</span>
                        <span>• {timeAgo}</span>
                    </div>
                </div>

                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-gray-600 line-camp">{content}</p>

                <div className="flex items-center justify-end text-sm text-gray-500 gap-2 mt-2">
                    <Link href={`/forum/${id}`}>
                        
                    </Link>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-1 hover:text-primary focus:outline-none">
                                <MessageCircle className="w-4 h-4" />
                                <span>{commentsCount}</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md bg-white">
                            <DialogHeader>
                                <DialogTitle>Add a comment</DialogTitle>
                            </DialogHeader>
                            <NewCommentDialog forumPostId={id} />
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    )
}