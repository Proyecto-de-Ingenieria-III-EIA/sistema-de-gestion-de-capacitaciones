import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const queries = {
  // User queries
  getUsers: async () => prisma.user.findMany(),

  getUserById: async (_: unknown, args: { id: string }) =>
    prisma.user.findUnique({ where: { id: args.id } }),

  getUserByEmail: async (_: unknown, args: { email: string }) =>
    prisma.user.findUnique({ where: { email: args.email } }),
};
