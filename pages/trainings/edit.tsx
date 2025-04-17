import AssessmentsTable from "@/components/atomic-design/molecules/assessments-table";
import EnrollmentsTable from "@/components/atomic-design/molecules/enrollments-table";
import TrainingMaterialsTable from "@/components/atomic-design/molecules/training-materials-table";
import AdminLayout from "@/components/layouts/admin-layout";
import EditForm, { FieldConfig } from "@/components/templatesa/Edit";
import { UPDATE_TRAINING } from "@/graphql/frontend/trainings";
import { GET_INSTRUCTORS } from "@/graphql/frontend/users";
import { TrainingWithInstructor } from "@/types/training-instructor";
import { useMutation, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import * as z from "zod";

export default function EditTraining() {
  const { data: session } = useSession();

  const { data: instructorData, loading: instructorLoading, error: instructorError } = useQuery(
    GET_INSTRUCTORS,
    {
      context: {
        headers: {
          "session-token": session?.sessionToken,
        },
      },
    }
  );

  const [updateTraining] = useMutation(UPDATE_TRAINING, {
    context: {
      headers: {
        "session-token": session?.sessionToken,
      },
    },
    refetchQueries: ["GetTrainings"],
  });

  const [trainingData, setTrainingData] = useState<TrainingWithInstructor | null>(null);

  useEffect(() => {
    const storedTraining = localStorage.getItem("selectedTraining");
    if (storedTraining) {
      setTrainingData(JSON.parse(storedTraining));
    } else {
      console.error("No training data found in storage.");
    }
  }, []);

  if (instructorLoading) return <p>Loading instructors...</p>;
  if (instructorError) return <p>Error loading instructors: {instructorError.message}</p>;

  if (!trainingData) {
    return <p>Loading...</p>;
  }

  const instructorOptions = instructorData?.getInstructors.map((instructor: any) => ({
    value: instructor.id,
    label: instructor.name,
  }));

  const fields: FieldConfig[] = [
    {
      name: "title",
      label: "Title",
      placeholder: "Enter the training title",
      description: "The title of the training.",
      type: "text",
      validation: z.string().min(2, { message: "The title must be at least 2 characters long." }),
    },
    {
      name: "description",
      label: "Description",
      placeholder: "Enter the training description",
      description: "A brief description of the training.",
      type: "text",
      validation: z.string().min(5, { message: "The description must be at least 5 characters long." }),
    },
    {
      name: "instructorId",
      label: "Instructor",
      placeholder: "Select an instructor",
      description: "The instructor responsible for the training.",
      type: "dropdown",
      validation: z.string().nonempty({ message: "An instructor must be selected." }),
      options: instructorOptions,
    },
    {
      name: "isHidden",
      label: "Hidden",
      placeholder: "Mark as hidden",
      description: "Set whether the training is hidden.",
      type: "checkbox",
      validation: z.boolean(),
    },
    {
      name: "isPublic",
      label: "Public",
      placeholder: "Mark as public",
      description: "Set whether the training is public.",
      type: "checkbox",
      validation: z.boolean(),
    },
  ];

  async function handleSubmit(values: Record<string, any>) {
    try {
      const { data } = await updateTraining({
        variables: {
          id: trainingData?.id,
          title: values.title,
          description: values.description,
          instructorId: values.instructorId,
          isHidden: values.isHidden,
          isPublic: values.isPublic,
        },
      });
      setTrainingData(data.updateTraining);
      localStorage.setItem("selectedTraining", JSON.stringify(data.updateTraining));
      alert("Training updated successfully!");
    } catch (err) {
      console.error("Error updating training:", err);
      alert("Failed to update training.");
    }
  }

  return (
    <AdminLayout>
      <EditForm
        title="Edit Training"
        description="Update the details of the training."
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonLabel="Update Training"
        initialData={{
          ...trainingData,
          instructorId: trainingData.instructor?.id || "",
        }}
      />

      {/* Enrollments Table */}
      <EnrollmentsTable
        trainingId={trainingData.id}
      />
      {/* Training materials */}
      <TrainingMaterialsTable
        trainingId={trainingData.id}
      />

      {/* Assessments */}
      <AssessmentsTable
        trainingId={trainingData.id}
        canModifyAssessment={true}
      />

    </AdminLayout>
  );
}