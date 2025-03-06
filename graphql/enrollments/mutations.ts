import { Context } from '@/types';
import { EnrollmentStatus } from '@prisma/client';

export const mutations = {
  // Enrollment mutations
  enrollUser: async (
    _: unknown,
    args: { userId: string; trainingId: string },
    { db }: Context
  ) =>
    db.enrollment.create({
      data: {
        userId: args.userId,
        trainingId: args.trainingId,
        status: EnrollmentStatus.PENDING,
      },
    }),

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
