import { ForumPostCard } from "../molecules/forum-card";
import { useSession } from "next-auth/react";
import { ForumPost } from "@/types/forum-post";


export function ForumPostList({ posts, isAdmin }: { posts: ForumPost[]; isAdmin: boolean }) {

    return (
        <div className="flex flex-col gap-4">
            {posts.map((post) => (
                <ForumPostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    content={post.content}
                    author={post.user?.name ?? "Anónimo"}
                    createdAt={post.createdAt}
                    training={post.training?.title ?? "General"}
                    commentsCount={post._count?.comments ?? 0}
                    isAdmin={isAdmin}
                />
            ))}
        </div>
    );
}