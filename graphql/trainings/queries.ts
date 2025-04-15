import { Context } from '@/types';
import { validateRole } from '@/utils/validateRole';

export const queries = {
  // Training queries
  getTrainings: async (_: unknown, __: unknown, { db, authData }: Context) => {

    await validateRole( db, authData, ['ADMIN']);
    
    return db.training.findMany({
      include: {
        instructor: true,
        assessments: true,
        enrollments: true,
        forumPosts: true,
      }
    });
  },

  getTrainingById: async (_: unknown, args: { id: string }, { db }: Context) =>
    db.training.findUnique({ where: { id: args.id } }),

  getTrainingsByUser: async (_: unknown, args: { userId: string }, { db }: Context) => {
    const enrollments = await db.enrollment.findMany({
      where: { userId: args.userId },
      include: { training: true },
    });

    return enrollments.map((enrollment) => enrollment.training);
  },

  //Training materials queries
  getTrainingMaterials: async (
    _: unknown,
    args: { trainingId: string },
    { db }: Context
  ) =>
    db.trainingMaterial.findMany({
      where: { trainingId: args.trainingId },
    }),
};
