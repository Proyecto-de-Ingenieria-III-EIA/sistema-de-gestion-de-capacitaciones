import { Context } from '@/types';
import { validateAuth } from '@/utils/validateAuth';
import { validateRole } from '@/utils/validateRole';

export const queries = {

  getUsers: async ({ db, authData }: Context) => {
    validateRole(db, authData, ['ADMIN', 'INSTRUCTOR']);
    return db.user.findMany();
  },

  getUserById: async (_: unknown, args: { id: string }, { db }: Context) =>
    db.user.findUnique({ where: { id: args.id } }),

  getUserByEmail: async (
    _: unknown,
    args: { email: string },
    { db }: Context
  ) => db.user.findUnique({ where: { email: args.email } }),

  getInstructors: async (
    _: unknown,
    __: unknown,
    { db, authData }: Context
  ) => {
    validateAuth(authData); 
    return db.user.findMany({ where: { roleId: 2 } }); 
  },

  getUserAssessmentProgressInTraining: async (
    _: unknown,
    args: { userId: string; trainingId: string },
    { db, authData }: Context
  ) => {
    validateAuth(authData);
  
    const assessments = await db.assessment.findMany({
      where: { trainingId: args.trainingId },
      select: {
        id: true,
      },
    });
  
    const assessmentResults = await db.assessmentResult.findMany({
      where: {
        userId: args.userId,
        assessmentId: { in: assessments.map((a) => a.id) },
      },
      select: {
        score: true,
      },
    });
  
    // Calculate progress
    const totalAssessments = assessments.length;
    const completedAssessments = assessmentResults.length;
    const passedAssessments = assessmentResults.filter((result) => result.score >= 80).length; 
    const progress = totalAssessments > 0 ? (completedAssessments / totalAssessments) * 100 : 0;
  
    return {
      totalAssessments,
      completedAssessments,
      passedAssessments,
      progress: progress.toFixed(2),
    };
  },

};
