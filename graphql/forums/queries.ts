import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const queries = {
  // Forum queries
  getForumPosts: async () => prisma.forumPost.findMany(),

  getForumPostById: async (_: unknown, args: { id: string }) =>
    prisma.forumPost.findUnique({ where: { id: args.id } }),
};
