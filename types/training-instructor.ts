import { Training } from "@prisma/client";

export type TrainingWithInstructor = Training & {
    instructor?: {
      id: string;
      name: string;
    };
  };