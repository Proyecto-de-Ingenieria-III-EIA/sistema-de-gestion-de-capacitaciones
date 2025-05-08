import { formatDistanceToNow } from "date-fns";


export function CommentCard({ author, content, createdAt }: {author: string; content: string; createdAt: string}) {
    const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

    return (
        <div className="border rounded p-4 bg-gray-50">
            <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{author}</span>
                <span>• {timeAgo}</span>
            </div>
            <p className="mt-2 text-gray-700">{content}</p>
        </div>
    )
}