import { Context } from '@/types';

export const queries = {
  // Forum queries
  getForumPosts: async ({ db }: Context) => db.forumPost.findMany(),

  getForumPostById: async (_: unknown, args: { id: string }, { db }: Context) =>
    db.forumPost.findUnique({ where: { id: args.id } }),
};
