import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UserByEmailInput {
  email: string;
}

const userResolvers = {
  Query: {
    getUsers: async () => {
      return await prisma.user.findMany();
    },
    getUserByEmail: async (parent, args: UserByEmailInput, context) => {
      return await prisma.user.findUnique({
        where: {
          email: args.email,
        },
      });
    },
  },
};

export { userResolvers };
