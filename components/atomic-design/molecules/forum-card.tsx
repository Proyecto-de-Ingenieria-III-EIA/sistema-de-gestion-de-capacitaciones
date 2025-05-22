import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { UserAvatar } from "../atoms/user-avatar";
import { MessageCircle, Trash2 } from "lucide-react";
import { ForumPostCardProps } from "@/types/forum-postcard";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { NewCommentDialog } from "../organisms/new-comment-dialog";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import { DELETE_FORUM_POST, GET_FORUM_POSTS_WITH_FILTER } from "@/graphql/frontend/forum";
import { toast } from "sonner";
import { DeletePostDialog } from "./delete-post-dialog";
  

export function ForumPostCard({
    id,
    title,
    content,
    author,
    createdAt,
    training,
    commentsCount = 0,
    showActions,
    isAdmin,
    filter
} : ForumPostCardProps) {
    const timeAgo = formatDistanceToNow(new Date(createdAt), {addSuffix: true});

    const [ deleteForumPost ] = useMutation(DELETE_FORUM_POST, {
        refetchQueries: [ { query: GET_FORUM_POSTS_WITH_FILTER, variables: { filter } }],
    })

    const handleDelete = async () => {
        try {
            await deleteForumPost({ variables: { id } });
            toast.success("Post deleted successfully");
        } catch (error) {
            console.error("Error al eliminar el post:", error);
            toast.error("Error al eliminar el post");
        }
    }

    return (
        <Card className="mb-4 hover:shadow transition-shadow">
            <CardContent className="flex flex-col gap-2 p-4">
                <div className="flex justify-between items-start">
                    <Badge className="bg-purple-200 text-purple-800">{training}</Badge>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{author}</span>
                        <span>• {timeAgo}</span>
                    </div>
                </div>

                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-gray-600 line-camp">{content}</p>

                { showActions !== false && (
                    <div className="flex items-center justify-end text-sm text-gray-500 gap-2 mt-2">
                        <Link href={`/forum/${id}`}>
                            <Button variant="ghost" className="px-2 py-1 text-sm">
                                View comments
                            </Button>
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

                        { isAdmin && (
                            <DeletePostDialog onDelete={handleDelete}/>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}