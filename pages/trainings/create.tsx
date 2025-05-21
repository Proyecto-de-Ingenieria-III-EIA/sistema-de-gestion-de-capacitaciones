import CreateForm from "@/components/templates/Create";
import * as z from "zod";
import { toast } from "sonner";
import { useMutation, useQuery } from "@apollo/client";
import { GET_INSTRUCTORS } from "@/graphql/frontend/users";
import { CREATE_TRAINING, GET_TRAININGS } from "@/graphql/frontend/trainings";
import AdminLayout from "@/components/layouts/admin-layout";
import router from "next/router";

export default function CreateTraining() {
  const [createTraining, { loading: mutationLoading, error: mutationError }] = useMutation(CREATE_TRAINING, {
    refetchQueries: [{
      query: GET_TRAININGS,
    }],
  });

  const { data, loading, error } = useQuery(GET_INSTRUCTORS);

  if (loading) return <p>Loading instructors...</p>;
  if (error) return <p>Error loading instructors: {error.message}</p>;

  const instructorOptions = data?.getInstructors.map((instructor: any) => ({
    value: instructor.id,
    label: instructor.name,
  }));

  const fields = [
    {
      name: "title",
      label: "Title",
      placeholder: "Title",
      description: "Enter the name of the new training.",
      validation: z.string().min(2, { message: "The title must be longer." }),
    },
    {
      name: "description",
      label: "Description",
      placeholder: "Description",
      description: "Enter the trainings's description.",
      validation: z.string().min(5, { message: "The description must be longer" }),
    },
    {
      name: "instructor",
      label: "Instructor",
      placeholder: "Nombre del instructor",
      description: "Select the instructor responsible for this training.",
      validation: z.string().nonempty({ message: "The instructor is required." }),
      options: instructorOptions,
    },
  ];

  async function handleSubmit(values: Record<string, any>) {
    if (mutationLoading) return <p>Creating training...</p>;
    if (mutationError) return <p>Error creating training: {mutationError.message}</p>;

    try {
      const { data } = await createTraining({
        variables: {
          title: values.title,
          description: values.description,
          instructorId: values.instructor,
        },
      });

      if (data?.createTraining) {
        toast.success("Training created successfully!");
      }
      router.push("/admin-dashboard");
    } catch (error) {
      console.error("Error creating training:", error);
      toast.error("Failed to create training. Please try again.");
    }
  }

  return (
    <AdminLayout>
      <CreateForm
        title="New Training"
        description="Please fill the fields with the new trainings's information."
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonLabel="Create"
      />
    </AdminLayout>
  );
}