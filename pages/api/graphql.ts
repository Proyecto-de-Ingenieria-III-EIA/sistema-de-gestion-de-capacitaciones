import { resolvers, types } from '@/graphql';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { gql } from 'graphql-tag';

export const schema = makeExecutableSchema({ typeDefs: types, resolvers });

const server = new ApolloServer({
  schema,
});

export default startServerAndCreateNextHandler(server);
