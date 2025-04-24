import { Context } from '@/types';
import { validateAuth } from '@/utils/validateAuth';
import { validateRole } from '@/utils/validateRole';

export const queries = {
  getUsers: async (_: unknown, __: unknown, { db, authData }: Context) => {
    validateRole(db, authData, ['ADMIN', 'INSTRUCTOR']);
    return db.user.findMany({
      include: {
        role: true,
      },
    });
  },

  getUserById: async (
    _: unknown,
    args: { id: string },
    { db, authData }: Context
  ) => {
    await validateRole(db, authData, ['ADMIN', 'INSTRUCTOR']);

    return db.user.findUnique({
      where: { id: args.id },
      include: {
        role: true,
        enrollments: {
          include: {
            training: true,
          },
        },
      },
    });
  },

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

    const assessmentResults = await db.assessmentResult.groupBy({
      by: ['assessmentId'],
      where: {
        userId: args.userId,
        assessmentId: { in: assessments.map((a) => a.id) },
      },
      _max: {
        score: true,
      },
    });

    // Calculate progress
    const totalAssessments = assessments.length;
    const passedAssessments = assessmentResults.filter(
      (result) => (result._max?.score ?? 0) >= 80
    ).length;
    const progress =
      totalAssessments > 0 ? (passedAssessments / totalAssessments) * 100 : 0;

    return {
      totalAssessments,
      passedAssessments,
      progress: progress.toFixed(2),
    };
  },

  getUserProgressForTrainings: async (
    _: unknown,
    args: { userId: string; trainingIds: string[] },
    { db, authData }: Context
  ) => {
    validateAuth(authData);

    const enrollments = await db.enrollment.findMany({
      where: { userId: args.userId },
      include: {
        training: true,
      },
    });

    const progressResults = await Promise.all(
      enrollments.map(async (enrollment) => {
        const trainingId = enrollment.training.id;

        const progress = await queries.getUserAssessmentProgressInTraining(
          _,
          { userId: args.userId, trainingId },
          { db, authData }
        );

        return {
          trainingId,
          trainingTitle: enrollment.training.title,
          ...progress,
        };
      })
    );

    return progressResults;
  },
};
