import { Context } from '@/types';
import { EnrollmentStatus } from '@prisma/client';

export const mutations = {
  // Enrollment mutations
  subscribeToTraining: async (
    _: unknown, 
    args: { trainingId: string }, 
    { db, authData }: Context
  ) => {
    if (!authData) {
      throw new Error('Unauthorized');
    }

    const training = await db.training.findUnique({
      where: { id: args.trainingId },
      select: { id: true, isPublic: true }, // tiene en cuenta si es publico o no
    });

    if (!training) {
      throw new Error('Training not found');
    }

    // el usuario ya esta inscrito?
    const existingEnrollment = await db.enrollment.findFirst({
      where: {
          trainingId: args.trainingId,
          userId: authData.id,
      },
    });

    if (existingEnrollment) {
      throw new Error('Already enrolled to this training');
    }

    //aprovar si es público, sino pendiente
    const status = training.isPublic ? 'APPROVED' : 'PENDING';

    const newEnrollment = await db.enrollment.create({
      data: {
        trainingId: args.trainingId,
        userId: authData.id,
        status
      },
      include: {
        user: { select: { id: true, name: true, enrollments: true } }, // incluir el usuario
        training: { select: { id: true, title: true, enrollments: true } }, // incluir el training
      },
    });

    return newEnrollment;
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
};
