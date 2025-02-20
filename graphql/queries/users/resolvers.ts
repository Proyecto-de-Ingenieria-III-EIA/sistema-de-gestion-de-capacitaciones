interface UserByEmailInput {
  email: string;
}

const userResolvers = {
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
