import { Context } from '@/types';
import { validateAuth } from '@/utils/validateAuth';
import { validateRole } from '@/utils/validateRole';

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

  getAssessmentById: async (
    _: unknown,
    args: { assessmentId: string },
    { db, authData }: Context
  ) => {
    await validateAuth(authData);

    if (!args.assessmentId) {
      throw new Error("Assessment ID is required.");
    }

    const assessment = await db.assessment.findUnique({
      where: { id: args.assessmentId },
      include: {
        questions: true,
        training: true,
      },
    });

    return assessment;
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
  getAssessmentMetrics: async (
    _: unknown,
    args: { assessmentId: string },
    { db, authData }: Context
  ) => {
    await validateRole(db, authData, ['ADMIN', 'INSTRUCTOR']);

    const results = await db.assessmentResult.findMany({
      where: { assessmentId: args.assessmentId },
    });

    if (results.length === 0) {
      return {
        meanScore: 0,
        maxScore: 0,
        minScore: 0,
      };
    }

    const totalScore = results.reduce((acc, result) => acc + result.score, 0);
    const meanScore = totalScore / results.length;
    const maxScore = Math.max(...results.map((result) => result.score));
    const minScore = Math.min(...results.map((result) => result.score));

    return {
      meanScore,
      maxScore,
      minScore,
    };
  }
};
