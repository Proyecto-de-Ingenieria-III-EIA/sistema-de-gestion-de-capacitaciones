import { Enum_RoleName, PrismaClient, User } from '@prisma/client';
import { GraphQLError } from 'graphql';

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
    role: async (parent: User, args, { db }) => {
      const role = await db.$queryRaw`
      select r.* from ejemplo_proyecto."Role" r
        join ejemplo_proyecto."User" u
            on u."roleId" = r.id
      where u.id = ${parent.id}
      `;

      console.log(role);

      return role[0];
    },
  },
  Query: {
    getUsers: async (parent, args, { db, authData }) => {
      if (authData.role !== Enum_RoleName.ADMIN) {
        throw new GraphQLError('Not authorized. Admin role required.');
      }
      return await db.user.findMany();
    },
    getUserByEmail: async (
      parent,
      args: UserByEmailInput,
      { db, authData }
    ) => {
      if (![Enum_RoleName.ADMIN, Enum_RoleName.USER].includes(authData.role)) {
        throw new GraphQLError('Not authorized. Admin or User role required.');
      }
      return await db.user.findUnique({
        where: {
          email: args.email,
        },
      });
    },
  },
  Mutation: {
    updateUserRole: async (parent, args, { db }) => {
      console.log(args);

      const role = await db.role.findFirst({
        where: {
          name: args.name,
        },
      });

      return db.user.update({
        where: {
          id: args.id,
        },
        data: {
          roleId: role.id,
        },
      });
    },
  },
};

export { userResolvers };
