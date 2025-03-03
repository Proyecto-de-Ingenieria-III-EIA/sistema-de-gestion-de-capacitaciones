import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const mutations = {
  // Forum mutations
  createForumPost: async (
    _: unknown,
    args: { title: string; content: string; userId: string; trainingId: string }
  ) =>
    prisma.forumPost.create({
      data: {
        title: args.title,
        content: args.content,
        userId: args.userId,
        trainingId: args.trainingId,
      },
    }),

  updateForumPost: async (
    _: unknown,
    args: { id: string; title?: string; content?: string }
  ) =>
    prisma.forumPost.update({
      where: { id: args.id },
      data: {
        title: args.title,
        content: args.content,
      },
    }),

  deleteForumPost: async (_: unknown, args: { id: string }) => {
    await prisma.forumPost.delete({ where: { id: args.id } });
    return true;
  },

  // Comment mutations
  createComment: async (
    _: unknown,
    args: { content: string; userId: string; forumPostId: string }
  ) =>
    prisma.comment.create({
      data: {
        content: args.content,
        userId: args.userId,
        forumPostId: args.forumPostId,
      },
    }),

  deleteComment: async (_: unknown, args: { id: string }) => {
    await prisma.comment.delete({ where: { id: args.id } });
    return true;
  },
};
