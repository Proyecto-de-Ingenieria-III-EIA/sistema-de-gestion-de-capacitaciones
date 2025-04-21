import { Context } from '@/types';
import { validateRole } from '@/utils/validateRole';

export const mutations = {
  // User mutations
  updateUser: async (
    _: unknown,
    args: {
      id: string;
      name?: string;
      phone?: string;
      area?: string;
      image?: string;
    },
    { db }: Context
  ) =>
    db.user.update({
      where: { id: args.id },
      data: {
        name: args.name,
        phone: args.phone,
        area: args.area,
        image: args.image,
      },
  }),

  updateUsers: async (
    _: unknown,
    args: { users: { id: string; name?: string; phone?: string; area?: string; roleId?: number }[] },
    { db, authData }: Context
  ) => {
    await validateRole(db, authData, ['ADMIN', 'INSTRUCTOR']);

    const updatePromises = args.users.map((user) =>
      db.user.update({
        where: { id: user.id },
        data: {
          name: user.name,
          phone: user.phone,
          area: user.area,
          roleId: typeof user.roleId === "string" ? parseInt(user.roleId, 10) : user.roleId,
        },
      })
    );
  
    return Promise.all(updatePromises);
  },

  deleteUser: async (_: unknown, args: { id: string }, { db }: Context) => {
    await db.user.delete({ where: { id: args.id } });
    return true;
  },
};
