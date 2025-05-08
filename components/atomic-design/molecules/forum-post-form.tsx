import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CREATE_FORUM_POST, GET_FORUM_POSTS } from "@/graphql/frontend/forum";
import { GET_TRAININGS, GET_TRAININGS_BY_USER } from "@/graphql/frontend/trainings";
import { useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod"

const schema = z.object({
    title: z.string().min(3, { message: "Titulo es requerido" }),
    content: z.string().min(5, { message: "Contenido es requerido" }),
    trainingId: z.string().min(1, { message: "Selecciona un training" }),
});

export function ForumPostForm() {

    const { data: session } = useSession();
    const [createPost, { loading }] = useMutation(CREATE_FORUM_POST, {
        refetchQueries: [{query: GET_FORUM_POSTS}],

    });
    const { data: trainingsData, loading: trainingsLoading } = useQuery(GET_TRAININGS_BY_USER, 
        {
            variables: { userId: session?.user?.id },
            skip: !session?.user?.id,
        }
    );

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            content: "",
            trainingId: "",
        }
    });

    const onSubmit = async (values: z.infer<typeof schema>) => {
        if (!session?.user?.id) return;
        try {
            await createPost({
                variables: {
                    ...values,
                    userId: session.user.id,
                },
            });
            form.reset();
        } catch (error) {
            console.error("Error creating post", error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="¿What is your question?" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Question</FormLabel>
                            <FormControl>
                                <Textarea rows={5} placeholder="Explain"{...field}/>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="trainingId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select a training</FormLabel>
                            <FormControl>
                                <select
                                    {...field}
                                    className="w-full p-2 rounded border"
                                    disabled={trainingsLoading}
                                >
                                    <option value="">--Select a training--</option>
                                    {trainingsData?.getTrainingsByUser.map((training: any) => (
                                        <option key={training.id} value={training.id}>
                                            {training.title}
                                        </option>
                                    ))}
                                </select>
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading}>
                    {loading ? "Publicando..." : "Publicar"}
                </Button>
            </form>
        </Form>
    )
}