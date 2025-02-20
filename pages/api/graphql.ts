import { resolvers, types } from '@/graphql';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Enum_RoleName, PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export const schema = makeExecutableSchema({ typeDefs: types, resolvers });

interface Context {
  db: PrismaClient;
  authData: {
    email: string;
    role: Enum_RoleName;
    expires: Date;
  };
}

const server = new ApolloServer<Context>({
  schema,
});

export default startServerAndCreateNextHandler(server, {
  context: async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers['session-token'];

    const authData = await prisma.$queryRaw`
    select 
    u.email,
    r."name" as "role",
    s.expires
    from ejemplo_proyecto."Session" s
        join ejemplo_proyecto."User" u
            on s."userId" = u.id
        join ejemplo_proyecto."Role" r
            on u."roleId" = r.id
    where s."sessionToken" = ${token}
    `;

    console.log(authData);

    return {
      db: prisma,
      authData: authData[0],
    };
  },
});
