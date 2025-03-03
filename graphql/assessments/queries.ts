import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const queries = {
  // Get assessments for a specific training
  getAssessments: async (_: unknown, args: { trainingId: string }) =>
    prisma.assessment.findMany({
      where: { trainingId: args.trainingId },
      include: {
        questions: true,
      },
    }),

  // Get results of an assessment
  getAssessmentResults: async (_: unknown, args: { assessmentId: string }) =>
    prisma.assessmentResult.findMany({
      where: { assessmentId: args.assessmentId },
      include: {
        user: true,
      },
    }),
};
