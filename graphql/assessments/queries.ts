import { Context } from '@/types';

export const queries = {
  // Get assessments for a specific training
  getAssessments: async (
    _: unknown,
    args: { trainingId: string },
    { db }: Context
  ) =>
    db.assessment.findMany({
      where: { trainingId: args.trainingId },
      include: {
        questions: true,
      },
    }),

  // Get results of an assessment
  getAssessmentResults: async (
    _: unknown,
    args: { assessmentId: string },
    { db }: Context
  ) =>
    db.assessmentResult.findMany({
      where: { assessmentId: args.assessmentId },
      include: {
        user: true,
      },
    }),
};
