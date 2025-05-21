import { Context } from '@/types';
import { validateRole } from '@/utils/validateRole';
import { EnrollmentStatus } from '@prisma/client';

export const mutations = {
  subscribeToTraining: async (
    _: unknown,
    args: { trainingId: string; userId?: string },
    { db, authData }: Context
  ) => {
    if (!authData) {
      throw new Error('Unauthorized');
    }

    const training = await db.training.findUnique({
      where: { id: args.trainingId },
      select: { id: true, isPublic: true },
    });

    if (!training) {
      throw new Error('Training not found');
    }

    const userId = args.userId || authData.id;

    if (args.userId && authData.role !== 'ADMIN') {
      throw new Error('Only admins can subscribe other users to a training');
    }

    const existingEnrollment = await db.enrollment.findFirst({
      where: {
        trainingId: args.trainingId,
        userId: userId,
      },
    });

    if (existingEnrollment) {
      throw new Error('Already enrolled to this training');
    }

    const isAdmin = authData.role === 'ADMIN';

    const status = isAdmin || training.isPublic ? 'APPROVED' : 'PENDING';

    const newEnrollment = await db.enrollment.create({
      data: {
        trainingId: args.trainingId,
        userId: userId,
        status,
      },
      include: {
        user: { select: { id: true, name: true, enrollments: true } },
        training: { select: { id: true, title: true, enrollments: true } },
      },
    });

    return newEnrollment;
  },

  enrollToPublicTraining: async (
    _: unknown,
    args: { trainingId: string },
    { db, authData }: Context
  ) => {
    if (!authData) {
      throw new Error('Unauthorized');
    }

    const userId = authData.id;

    const training = await db.training.findUnique({
      where: { id: args.trainingId },
      select: { id: true, isPublic: true },
    });

    if (!training) {
      throw new Error('Training not found');
    }

    if (!training.isPublic) {
      throw new Error('You can only enroll in public trainings');
    }
    const alreadyEnrolled = await db.enrollment.findFirst({
      where: {
        trainingId: args.trainingId,
        userId: userId,
      },
    });

    if (alreadyEnrolled) {
      throw new Error('You are already enrolled in this training');
    }

    const enrollment = await db.enrollment.create({
      data: {
        trainingId: args.trainingId,
        userId: userId,
        status: 'APPROVED',
      },
      include: {
        training: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return enrollment;
  },

  updateEnrollmentStatus: async (
    _: unknown,
    args: { id: string; status: EnrollmentStatus },
    { db }: Context
  ) =>
    db.enrollment.update({
      where: { id: args.id },
      data: { status: args.status },
    }),

  deleteEnrollment: async (
    _: unknown,
    args: { id: string },
    { db, authData }: Context
  ) => {
    await validateRole(db, authData, ['ADMIN']);

    const enrollment = await db.enrollment.findUnique({
      where: { id: args.id },
    });

    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    return db.enrollment.delete({
      where: { id: args.id },
    });
  },
};
