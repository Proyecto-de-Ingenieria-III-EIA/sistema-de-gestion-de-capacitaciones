import React from "react";
import { Card } from "@/components/atomic-design/molecules/card";
import { Training } from "@prisma/client";

interface TrainingsListProps {
  trainings: Training[]; 
  buttons: { label: string; onClick: (training: Training) => void }[]; 
}

export const TrainingsList: React.FC<TrainingsListProps> = ({ trainings, buttons }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {trainings.map((training) => (
        <Card
          key={training.id}
          imageSrc={training.imageSrc || "https://via.placeholder.com/300"}
          title={training.title}
          text={training.description}
          buttons={buttons.map((button) => ({
            label: button.label,
            onClick: () => button.onClick(training), 
          }))}
        />
      ))}
    </div>
  );
};