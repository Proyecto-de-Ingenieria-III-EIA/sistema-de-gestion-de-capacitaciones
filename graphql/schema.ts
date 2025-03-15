import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers, types } from '@/graphql';


export const schema = makeExecutableSchema({
  typeDefs: types,
  resolvers,
});
