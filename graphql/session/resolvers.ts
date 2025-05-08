import { Context } from '@/types';

export const sessionResolvers = {
  Query: {
    getSession: async (
      _: unknown,
      args: { sessionToken: string },
      { db }: Context
    ) => {
      return db.session.findUnique({
        where: { sessionToken: args.sessionToken },
        include: { user: true },
      });
    },
  },

  Mutation: {
    createSession: async (
      _: unknown,
      args: { sessionToken: string; userId: string; expires: Date },
      { db }: Context
    ) => {
      return db.session.create({
        data: {
          sessionToken: args.sessionToken,
          userId: args.userId,
          expires: args.expires,
        },
        include: { user: true }, 
      });
    },

    deleteSession: async (
      _: unknown,
      args: { sessionToken: string },
      { db }: Context
    ) => {
      await db.session.delete({
        where: { sessionToken: args.sessionToken },
      });
      return true;
    },
  },

  Session: {
    user: async (parent: { userId: string }, _: unknown, { db }: Context) => {
      return db.user.findUnique({
        where: { id: parent.userId },
      });
    },
  },
};
