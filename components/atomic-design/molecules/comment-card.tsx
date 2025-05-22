import { formatDistanceToNow } from "date-fns";
import { DeletePostDialog } from "./delete-post-dialog";


export function CommentCard({ author, content, createdAt, isAdmin, onDelete }: {
    author: string; 
    content: string; 
    createdAt: string;
    isAdmin?: boolean;
    onDelete?: () => void;
}) {
    const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

    return (
        <div className="border rounded p-4 bg-gray-50">
            <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{author}</span>
                <span>• {timeAgo}</span>
                {isAdmin && onDelete && <DeletePostDialog onDelete={onDelete} />}
            </div>
            <p className="mt-2 text-gray-700">{content}</p>
        </div>
    )
}