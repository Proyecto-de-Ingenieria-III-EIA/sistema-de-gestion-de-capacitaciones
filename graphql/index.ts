import gql from 'graphql-tag';
import { userResolvers } from './users/resolvers';
import { userTypes } from './users/types';
import { sessionTypes } from './session/types';
import { roleTypes } from './role/types';
import { trainingTypes } from './trainings/types';
import { forumTypes } from './forums/types';
import { enrollmentTypes } from './enrollments/types';
import { trainingResolvers } from './trainings/resolvers';
import { roleResolvers } from './role/resolvers';
import { forumResolvers } from './forums/resolvers';
import { enrollmentResolvers } from './enrollments/resolvers';
import { assessmentTypes } from './assessments/types';
import { assessmentResolvers } from './assessments/resolvers';

const defaultTypes = gql`
  scalar DateTime
`;

const types = [
  defaultTypes,
  userTypes,
  sessionTypes,
  roleTypes,
  trainingTypes,
  roleTypes,
  forumTypes,
  enrollmentTypes,
  assessmentTypes,
];

const resolvers = [
  userResolvers,
  trainingResolvers,
  roleResolvers,
  forumResolvers,
  enrollmentResolvers,
  assessmentResolvers,
];

export { types, resolvers };
