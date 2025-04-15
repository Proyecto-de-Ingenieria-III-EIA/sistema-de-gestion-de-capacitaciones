import React from "react";
import { TrainingsList } from "@/components/atomic-design/organisms/trainings-list";
import { Training } from "@prisma/client";
import Header from "./header";
import { ChartPieIcon } from "lucide-react";
import AdminLayout from "@/components/layouts/admin-layout";
import router from "next/router";

interface AdminDashboardProps {
  trainings: Training[]; 
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ trainings }) => {
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
              console.log("Selected training:", training);
              router.push(`/trainings/edit?id=${training.id}`);
          }},
          {
            label: "Delete",
            onClick: (training: Training) => alert(`Deleting ${training.title}`),
          },
          {
            label: "Duplicate",
            onClick: (training: Training) => alert(`Duplicating ${training.title}`),
          },
        ]}
      />
    </AdminLayout>
    </div>
    );
};