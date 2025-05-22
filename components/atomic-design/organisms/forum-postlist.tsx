import { ForumPostCard } from "../molecules/forum-card";
import { useSession } from "next-auth/react";
import { ForumPost } from "@/types/forum-post";
import { useQuery } from "@apollo/client";
import { GET_FORUM_POSTS, GET_FORUM_POSTS_WITH_FILTER } from "@/graphql/frontend/forum";

interface ForumPostListProps {
    filter: any;
  isAdmin: boolean;
}
export function ForumPostList({ filter, isAdmin }: ForumPostListProps) {

     const { data, loading, error } = useQuery(GET_FORUM_POSTS_WITH_FILTER, {
            variables: { filter }
        });

        if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;
        if (!data || !data.getFilteredForumPosts) return <p className="text-center">No posts.</p>;

    return (
        <div className="flex flex-col gap-4">
            {data.getFilteredForumPosts.map((post: any) => (
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
                    filter={filter}
                />
            ))}
        </div>
    );
}