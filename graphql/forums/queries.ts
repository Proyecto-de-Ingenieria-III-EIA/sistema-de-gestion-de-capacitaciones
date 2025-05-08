import { Context } from '@/types';

export const queries = {
  // Forum queries
  getForumPosts: async (_: unknown, __: unknown, { db }: Context) => 
    db.forumPost.findMany({
      include: {
        user: {
          select: {id: true, name: true},
        },
        comments: {
          select: { id: true },
        },
        training: {
          select: { id: true, title: true },
        },
      }
    }),

  getForumPostById: async (_: unknown, args: { id: string }, { db }: Context) =>
    db.forumPost.findUnique({ 
      where: { id: args.id }, 
      include: {
        user: {
          select: { id: true, name: true },
        },
        training: {
          select: { id: true, title: true },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: { id: true, name: true },
            },
          }
        }
      }
    }),
};
