import { Context } from '@/types';

export const queries = {
  // Enrollment queries
  getEnrollments: async ({ db }: Context) => db.enrollment.findMany(),

  getEnrollmentsByUser: async (
    _: unknown,
    args: { userId: string },
    { db }: Context
  ) => db.enrollment.findMany({ where: { userId: args.userId } }),
};
