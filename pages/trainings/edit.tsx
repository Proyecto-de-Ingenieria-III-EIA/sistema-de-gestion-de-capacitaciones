import AdminLayout from "@/components/layouts/admin-layout";
import EditForm, { FieldConfig } from "@/components/templates/Edit";
import { GET_ENROLLMENTS } from "@/graphql/frontend/enrollments";
import { GET_INSTRUCTORS } from "@/graphql/frontend/users";
import { TrainingWithInstructor } from "@/types/training-instructor";
import { useQuery } from "@apollo/client";
import { TrashIcon, PlusIcon } from "lucide-react";
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
  
    const [trainingData, setTrainingData] = useState<TrainingWithInstructor | null>(null);
    const [participants, setParticipants] = useState([]);
  
    useEffect(() => {
      const storedTraining = localStorage.getItem("selectedTraining");
      if (storedTraining) {
        setTrainingData(JSON.parse(storedTraining));
      } else {
        console.error("No training data found in storage.");
      }
    }, []);
  
    const { data: enrollmentsData, loading: enrollmentsLoading, error: enrollmentsError } = useQuery(
      GET_ENROLLMENTS,
      {
        variables: {
          trainingId: trainingData?.id,
        },
        skip: !trainingData?.id,
        context: {
          headers: {
            "session-token": session?.sessionToken,
          },
        },
      }
    );
  
    useEffect(() => {
      if (enrollmentsData) {
        setParticipants(enrollmentsData.getEnrollmentsByTraining);
      }
    }, [enrollmentsData]);
  
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
      console.log("Updated Training Data:", values);
      // Add your update logic here
    }
  
    function handleFileUpload(file: File) {
      console.log("Uploaded file:", file);
      // Add your file upload logic here
    }
  
    const handleDeleteParticipant = (participantId: string) => {
      console.log("Delete participant:", participantId);
      // Add your delete logic here
    };
  
    const handleAddParticipant = () => {
      console.log("Add participant");
      // Add your add logic here
    };

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
      showFileUpload={true}
      onFileUpload={handleFileUpload}
    />

    {/* Enrollments Table */}
    <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Participants</h2>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Area</th>
              <th className="border border-gray-300 px-4 py-2">Progress</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant: any) => (
              <tr key={participant.id}>
                <td className="border border-gray-300 px-4 py-2">{participant.user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{participant.user.email}</td>
                <td className="border border-gray-300 px-4 py-2">{participant.user.area}</td>
                <td className="border border-gray-300 px-4 py-2">{participant.progress}</td>
                <td className="border border-gray-300 px-4 py-2">{participant.status}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleDeleteParticipant(participant.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={handleAddParticipant}
          className="mt-4 flex items-center text-blue-500 hover:text-blue-700"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Participant
        </button>
      </div>
    </AdminLayout>
  );
}