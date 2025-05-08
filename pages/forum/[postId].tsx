import { CommentCard } from "@/components/atomic-design/molecules/comment-card";
import { ForumPostCard } from "@/components/atomic-design/molecules/forum-card";
import { GET_FORUM_POST_BY_ID } from "@/graphql/frontend/forum";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";


export default function ForumPostPage() {
    const router = useRouter();
    const { postId } = router.query;

    const { data, loading, error } = useQuery(GET_FORUM_POST_BY_ID, {
        variables: { id: postId },
        skip: !postId,
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const post = data.getForumPostById;

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-6">
            <ForumPostCard
                id={post.id}
                title={post.title}
                content={post.content}
                author={post.user.name}
                createdAt={post.createdAt}
                training={post.training.title}
                commentsCount={post.comments.length}
            />

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Comments</h2>
                {post.comments.length === 0 ? (
                    <p>No comments yet. Be the first to comment!</p>
                ) : (
                    post.comments.map((comment: any) => (
                        <CommentCard 
                            key={comment.id}
                            content={comment.content}
                            author={comment.user.name}
                            createdAt={comment.createdAt}
                        />
                    ))
                )}
            </div>

            
        </div>
    )
}