import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    }
  ) =>
    prisma.user.update({
      where: { id: args.id },
      data: {
        name: args.name,
        phone: args.phone,
        area: args.area,
        image: args.image,
      },
    }),

  deleteUser: async (_: unknown, args: { id: string }) => {
    await prisma.user.delete({ where: { id: args.id } });
    return true;
  },
};
