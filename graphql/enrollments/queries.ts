import { Context } from '@/types';
import { validateAuth } from '@/utils/validateAuth';
import { validateRole } from '@/utils/validateRole';

export const queries = {
  // Enrollment queries
  getEnrollments: async ({ db }: Context) => db.enrollment.findMany(),

  getEnrollmentsByUser: async (
    _: unknown,
    args: { userId: string },
    { db }: Context
  ) => db.enrollment.findMany({ where: { userId: args.userId } }),

  getParticipantsProgress : async (_: unknown, __: unknown, { db, authData }: Context) => {
    
    await validateRole(db, authData, ['ADMIN']);

    const progressData = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        enrollments: {
          select: {
            trainingId: true,
            progress: true,
          },
        },
      },
    });

    //calcular porcentaje solo de aquellas COMPLETED
    const participantsProgress = progressData.map( u => {
      const totalTrainings = u.enrollments.length;
      const completedTrainings = u.enrollments.filter( e => e.progress === 'COMPLETED').length;
      const completionRate = totalTrainings > 0 ? (completedTrainings / totalTrainings) * 100 : 0;


      return {
        userId: u.id,
        name: u.name,
        email: u.email,
        totalTrainings,
        completedTrainings,
        completionRate: `${completionRate.toFixed(2)}%`,
      };
    });

    return participantsProgress;


    },

    getUserProgress: async (_: unknown, __: unknown, { db, authData }: Context) => {
      
      validateAuth(authData);

      const userEnrollments = await db.enrollment.findMany({
        where: { userId: authData.id },
        select: {
          trainingId: true,
          progress: true,
          status: true,
        },
      });

      const totalTrainings = userEnrollments.length;
      const completedTrainings = userEnrollments.filter( e => e.progress === 'COMPLETED' && e.status === 'APPROVED').length;

      const completionRate = totalTrainings > 0 ? (completedTrainings / totalTrainings) * 100 : 0;

      return {
        userId: authData.id,
        totalTrainings,
        completedTrainings,
        completionRate: `${completionRate.toFixed(2)}%`,
      };
    },

    getEnrollmentsByTraining: async (
      _: unknown,
      args: { trainingId: string },
      { db, authData }: Context
    ) => {
      // await validateRole(db, authData, ['ADMIN']);

      return db.enrollment.findMany({
        where: { trainingId: args.trainingId },
        include: { user: true },
      });
    }
};
