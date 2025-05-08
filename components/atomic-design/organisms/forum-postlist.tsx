import { GET_FORUM_POSTS } from "@/graphql/frontend/forum";
import { useQuery } from "@apollo/client";
import { ForumPostCard } from "../molecules/forum-card";


export function ForumPostList() {
    const { data, loading, error } = useQuery(GET_FORUM_POSTS);

    if (loading) return <p className="text-center py-8">Cargando posts...</p>;
    if (error) return <p className="text-red-500 text-center py-8">Error al cargar los posts</p>;

    return (
        <div className="flex flex-col gap-4">
            {data.getForumPosts.map((post: any) => (
                <ForumPostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    content={post.content}
                    author={post.user?.name ?? "Anónimo"}
                    createdAt={post.createdAt}
                    training={post.training?.title ?? "General"}
                    commentsCount={post.comments.length}
                />
            ))}
        </div>
    );
}