import { Context } from '@/types';

export const queries = {
  // User queries
  getUsers: async ({ db }: Context) => db.user.findMany(),

  getUserById: async (_: unknown, args: { id: string }, { db }: Context) =>
    db.user.findUnique({ where: { id: args.id } }),

  getUserByEmail: async (
    _: unknown,
    args: { email: string },
    { db }: Context
  ) => db.user.findUnique({ where: { email: args.email } }),
};
