import { Context } from '@/types';
import { validateAuth } from '@/utils/validateAuth';
import { validateRole } from '@/utils/validateRole';

export const queries = {

  getUsers: async ({ db, authData }: Context) => {
    validateRole(db, authData, ['ADMIN', 'INSTRUCTOR']);
    return db.user.findMany();
  },

  getUserById: async (_: unknown, args: { id: string }, { db }: Context) =>
    db.user.findUnique({ where: { id: args.id } }),

  getUserByEmail: async (
    _: unknown,
    args: { email: string },
    { db }: Context
  ) => db.user.findUnique({ where: { email: args.email } }),

  getInstructors: async (
    _: unknown,
    __: unknown,
    { db, authData }: Context
  ) => {
    validateAuth(authData); 
    return db.user.findMany({ where: { roleId: 2 } }); 
  },

};
