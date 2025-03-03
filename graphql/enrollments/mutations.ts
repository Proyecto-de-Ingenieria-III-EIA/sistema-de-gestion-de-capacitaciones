import { PrismaClient, EnrollmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const mutations = {
  // Enrollment mutations
  enrollUser: async (
    _: unknown,
    args: { userId: string; trainingId: string }
  ) =>
    prisma.enrollment.create({
      data: {
        userId: args.userId,
        trainingId: args.trainingId,
        status: EnrollmentStatus.PENDING,
      },
    }),

  updateEnrollmentStatus: async (
    _: unknown,
    args: { id: string; status: EnrollmentStatus }
  ) =>
    prisma.enrollment.update({
      where: { id: args.id },
      data: { status: args.status },
    }),
};
