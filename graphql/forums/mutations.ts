import { Context } from '@/types';
import { validateRole } from '@/utils/validateRole';

export const mutations = {
  createForumPost: async (
    _: unknown,
    args: {
      title: string;
      content: string;
      userId: string;
      trainingId: string;
    },
    { db }: Context
  ) =>
    db.forumPost.create({
      data: {
        title: args.title,
        content: args.content,
        userId: args.userId,
        trainingId: args.trainingId,
      },
    }),

  updateForumPost: async (
    _: unknown,
    args: { id: string; title?: string; content?: string },
    { db }: Context
  ) =>
    db.forumPost.update({
      where: { id: args.id },
      data: {
        title: args.title,
        content: args.content,
      },
    }),

  deleteForumPost: async (
    _: unknown,
    args: { id: string },
    { db }: Context
  ) => {
    await db.forumPost.delete({ where: { id: args.id } });
    return true;
  },

  // Comment mutations
  createComment: async (
    _: unknown,
    args: { content: string; userId: string; forumPostId: string },
    { db }: Context
  ) =>
    db.comment.create({
      data: {
        content: args.content,
        userId: args.userId,
        forumPostId: args.forumPostId,
      },
    }),

  deleteComment: async (
    _: unknown,
    args: { id: string },
    { db, authData }: Context
  ) => {
    await validateRole(db, authData, ['ADMIN']);

    await db.comment.delete({ where: { id: args.id } });
    return true;
  },
};
