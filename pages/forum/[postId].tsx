import { CommentCard } from "@/components/atomic-design/molecules/comment-card";
import { ForumPostCard } from "@/components/atomic-design/molecules/forum-card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { CREATE_COMMENT, DELETE_COMMENT, GET_FORUM_POST_BY_ID } from "@/graphql/frontend/forum";
import { useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";


const schema = z.object({
    content: z.string().min(1, { message: "Comment cannot be empty" }),
});

export default function ForumPostPage() {
    const router = useRouter();
    const { postId } = router.query;

    const { data, loading, error, refetch } = useQuery(GET_FORUM_POST_BY_ID, {
        variables: { id: postId },
        skip: !postId,
    });

    const { data: session } = useSession();

    const [createComment, { loading: creating }] = useMutation(CREATE_COMMENT, {
        refetchQueries: [{ query: GET_FORUM_POST_BY_ID, variables: { id: postId } }],
    });

    const [deleteComment] = useMutation(DELETE_COMMENT, {
        onCompleted: () => toast("Comentario eliminado" ),
        onError: () => toast("Error al eliminar el comentario"),
    })

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { content: "" },
    });

    const onSubmit = async (values: z.infer<typeof schema>) => {
        if (!session?.user?.id) return;

        await createComment({
            variables: {
                content: values.content,
                forumPostId: postId,
                userId: session.user.id,
            },
        });

        form.reset();

    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const post = data.getForumPostById;

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-6">
            <Button onClick={()=> router.push('/forum')}>Go back</Button>
            <ForumPostCard
                id={post.id}
                title={post.title}
                content={post.content}
                author={post.user.name}
                createdAt={post.createdAt}
                training={post.training.title}
                commentsCount={post.comments.length}
                showActions={false}
            />

            <div className="space-y-4 pb-48">
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
                            isAdmin={session?.user.roleName === "ADMIN"}
                            onDelete={async () => {
                                await deleteComment({ variables: { id: comment.id } });
                                refetch(); 
                            }}
                        />
                    ))
                )}
            </div>

            <div className="mt-6">
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
                    <h3 className="text-lg font-semibold mb-2"> Add a comment </h3>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Comment</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Write your comment here..." {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={creating}>
                                {creating ? "Posting..." : "Submit Comment"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>

            
        </div>
    )
}