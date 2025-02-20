import gql from 'graphql-tag';
import { userResolvers } from './queries/users/resolvers';
import { userTypes } from './queries/users/types';

const defaultTypes = gql`
  scalar DateTime
`;

const types = [defaultTypes, userTypes];

const resolvers = [userResolvers];

export { types, resolvers };
