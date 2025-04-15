import { Context } from '@/types';
import { validateAuth } from '@/utils/validateAuth';
import { validateRole } from '@/utils/validateRole';

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

  getUserTrainings: async (
    _: unknown,
    __: unknown,
    { db, authData }: Context
  ) => {
    
    validateAuth(authData);

    //llamar capacitaciones de un usuario que esten aprovadas

    const enrolledTrainings = await db.training.findMany({
      where: {
        enrollments: {
          some: {
            userId: authData.id,
            status: 'APPROVED',
          },
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        isHidden: true,
        isPublic: true,
        instructor: { select: {name: true} },
      },
    });


    return enrolledTrainings;
  },
  getInstructors: async (
    _: unknown,
    __: unknown,
    { db, authData }: Context
  ) => {
    validateAuth(authData); 
    return db.user.findMany({ where: { roleId: 2 } }); 
  },

};
