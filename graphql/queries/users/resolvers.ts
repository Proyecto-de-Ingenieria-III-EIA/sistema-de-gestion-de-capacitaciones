import { User } from '@prisma/client';

interface UserByEmailInput {
  email: string;
}

const userResolvers = {
  User: {
    sessions: async (parent: User, args, { db }) => {
      return await db.session.findMany({
        where: {
          userId: parent.id,
        },
      });
    },
  },
  Query: {
    getUsers: async (parent, args, { db }) => {
      return await db.user.findMany();
    },
    getUserByEmail: async (parent, args: UserByEmailInput, { db }) => {
      return await db.user.findUnique({
        where: {
          email: args.email,
        },
      });
    },
  },
};

export { userResolvers };
