import { Context } from '@/types';
import { validateAuth } from '@/utils/validateAuth';
import { validateRole } from '@/utils/validateRole';

export const queries = {
  getTrainings: async (_: unknown, __: unknown, { db, authData }: Context) => {
    await validateRole(db, authData, ['ADMIN']);

    return db.training.findMany({
      include: {
        instructor: true,
        materials: true,
        assessments: {
          include: {
            questions: true,
          },
        },
        enrollments: {
          include: {
            user: true,
          },
        },
        forumPosts: true,
      },
    });
  },

  getTrainingById: async (
    _: unknown,
    args: { trainingId: string },
    { db, authData }: Context
  ) => {
    await validateAuth(authData);

    if (!args.trainingId) {
      throw new Error('Training ID is required.');
    }

    const training = await db.training.findUnique({
      where: { id: args.trainingId },
      include: {
        instructor: true,
        materials: true,
        assessments: {
          include: {
            questions: true,
          },
        },
        enrollments: {
          include: {
            user: true,
          },
        },
        forumPosts: true,
      },
    });

    if (!training) {
      throw new Error('Training not found.');
    }

    return training;
  },

  getTrainingsByUser: async (
    _: unknown,
    args: { userId: string },
    { db }: Context
  ) => {
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
    { db, authData }: Context
  ) => {
    validateAuth(authData);
    return db.trainingMaterial.findMany({
      where: { trainingId: args.trainingId },
      include: { training: true },
    });
  },
};
