import { Context } from '@/types';
import { validateAuth } from '@/utils/validateAuth';

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
        assessmentResults: true,
      },
    }),

  getAssessmentResults: async (
    _: unknown,
    args: { assessmentId: string },
    { db, authData }: Context
  ) => {
    await validateAuth(authData);

    return db.assessmentResult.findMany({
      where: { assessmentId: args.assessmentId },
      include: {
        user: true,
      },
    });
  },

  getAssessmentResultsByUser: async (
    _: unknown,
    args: { userId: string; trainingId: string },
    { db, authData }: Context
  ) => {
    await validateAuth(authData);
      
    return db.assessmentResult.findMany({
      where: {
        userId: args.userId,
        assessment: {
          trainingId: args.trainingId, 
        },
      },
      include: {
        assessment: true, 
      },
    });
  },
};
