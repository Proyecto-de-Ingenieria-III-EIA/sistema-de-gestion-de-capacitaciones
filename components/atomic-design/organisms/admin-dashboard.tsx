import React from "react";
import { TrainingsList } from "@/components/atomic-design/organisms/trainings-list";
import { Training } from "@prisma/client";
import Header from "./header";
import { ChartPieIcon } from "lucide-react";
import AdminLayout from "@/components/layouts/admin-layout";
import router from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_TRAINING, DUPLICATE_TRAINING } from "@/graphql/frontend/trainings";
import { useSession } from "next-auth/react";

interface AdminDashboardProps {
  trainings: Training[]; 
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ trainings }) => {
  const { data: session } = useSession();

  const [deleteTraining] = useMutation(DELETE_TRAINING, {
    context: {
      headers: {
        "session-token": session?.sessionToken,
      },
    },
    refetchQueries: ["GetTrainings"], 
  });

  const [duplicateTraining] = useMutation(DUPLICATE_TRAINING, {
    context: {
      headers: {
        "session-token": session?.sessionToken,
      },
    },
    refetchQueries: ["GetTrainings"], 
  })

  const handleDeleteTraining = async (training: Training) => {
    if (confirm(`Are you sure you want to delete ${training.title}?`)) {
      try {
        await deleteTraining({ variables: { id: training.id } });
        alert("Training deleted successfully!");
      } catch (err) {
        console.error("Error deleting training:", err);
        alert("Failed to delete training.");
      }
    }
  };

  const handleDuplicateTraining = async (training: Training) => {
    try {
      await duplicateTraining({ variables: { trainingId: training.id } });
      alert("Training duplicated successfully!");
    }
    catch (err) {
      console.error("Error duplicating training:", err);
      alert("Failed to duplicate training.");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <AdminLayout>

      {/* Trainings List */}
      <TrainingsList
        trainings={trainings}
        buttons={[
          {
            label: "Edit",
            onClick: (training: Training) =>{
              localStorage.setItem("selectedTraining", JSON.stringify(training));
              router.push(`/trainings/edit?id=${training.id}`);
          }},
          {
            label: "Delete",
            onClick: handleDeleteTraining,
          },
          {
            label: "Duplicate",
            onClick: handleDuplicateTraining,
          },
        ]}
      />
    </AdminLayout>
    </div>
    );
};