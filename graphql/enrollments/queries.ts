import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const queries = {
  // Enrollment queries
  getEnrollments: async () => prisma.enrollment.findMany(),

  getEnrollmentsByUser: async (_: unknown, args: { userId: string }) =>
    prisma.enrollment.findMany({ where: { userId: args.userId } }),
};
