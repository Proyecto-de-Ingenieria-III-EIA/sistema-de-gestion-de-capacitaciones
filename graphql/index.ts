import { userResolvers } from './queries/users/resolvers';
import { userTypes } from './queries/users/types';

const types = [userTypes];

const resolvers = [userResolvers];

export { types, resolvers };
