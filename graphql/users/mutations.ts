import { Context } from '@/types';

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

  deleteUser: async (_: unknown, args: { id: string }, { db }: Context) => {
    await db.user.delete({ where: { id: args.id } });
    return true;
  },
};
