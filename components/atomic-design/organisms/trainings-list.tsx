import React from "react";
import { Card } from "@/components/atomic-design/molecules/card";
import { Training } from "@prisma/client";

interface TrainingsListProps {
  trainings: Training[]; // List of trainings to display
  buttons: { label: string; onClick: (training: Training) => void }[]; // Buttons to display for each training
}

export const TrainingsList: React.FC<TrainingsListProps> = ({ trainings, buttons }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {trainings.map((training) => (
        <Card
          key={training.id}
          imageSrc={training.imageSrc || "https://via.placeholder.com/300"}
          title={training.title}
          text={training.description}
          buttons={buttons.map((button) => ({
            label: button.label,
            onClick: () => button.onClick(training), // Pass the training to the onClick handler
          }))}
        />
      ))}
    </div>
  );
};