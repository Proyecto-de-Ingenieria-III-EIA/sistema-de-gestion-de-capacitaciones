import { Context } from '@/types';

export const sessionResolvers = {
  Query: {
    // Fetch a session by sessionToken
    getSession: async (
      _: unknown,
      args: { sessionToken: string },
      { db }: Context
    ) => {
      return db.session.findUnique({
        where: { sessionToken: args.sessionToken },
        include: { user: true }, // Include the user associated with the session
      });
    },
  },

  Mutation: {
    // Create a new session
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
        include: { user: true }, // Include the user associated with the session
      });
    },

    // Delete a session by sessionToken
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

  // Resolver for the `user` field in the `Session` type
  Session: {
    user: async (parent: { userId: string }, _: unknown, { db }: Context) => {
      return db.user.findUnique({
        where: { id: parent.userId },
      });
    },
  },
};
