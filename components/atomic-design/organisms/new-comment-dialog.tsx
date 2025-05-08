import { GET } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { CREATE_COMMENT, GET_FORUM_POSTS } from "@/graphql/frontend/forum";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
    content: z.string().min(1, { message: "Comment must not be empty" }),
});

export function NewCommentDialog({ forumPostId } : { forumPostId: string }) {
    const { data: session } = useSession();

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            content: "",
        },
    });

    const [createComment, { loading}] = useMutation(CREATE_COMMENT, {
        refetchQueries: [{ query: GET_FORUM_POSTS }],
    });

    const onSubmit = async (values: z.infer<typeof schema>) => {
        if (!session?.user?.id) return;

        await createComment({
            variables: {
                content: values.content,
                forumPostId,
                userId: session.user.id,
            }
        });
        form.reset();
    };

    return (

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}  className="space-y-4">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Comment</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Write your comment" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={loading}>
                            {loading ? "Loading..." : "Submit comment"}
                        </Button> 
                    </form>
                </Form>
    )
}