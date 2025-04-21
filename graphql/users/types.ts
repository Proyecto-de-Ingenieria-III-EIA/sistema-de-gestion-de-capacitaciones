import gql from 'graphql-tag';

export const userTypes = gql`
  scalar DateTime

  ## User Model
  type User {
    id: String!
    name: String
    email: String!
    emailVerified: DateTime
    image: String
    phone: String
    area: String
    role: Role
    createdAt: DateTime
    updatedAt: DateTime
    trainings: [Training]
    enrollments: [Enrollment]
    forumPosts: [ForumPost]
    comments: [Comment]
  }

  type UserAssessmentProgress {
    totalAssessments: Int!
    passedAssessments: Int!
    progress: Float!
  }

  input UpdateUserInput {
    id: String!
    name: String
    phone: String
    area: String
    roleId: Int
  }

  ## Queries
  type Query {
    # Users
    getUsers: [User]
    getUserById(id: String!): User
    getUserByEmail(email: String!): User
    getUserTrainings: [Training]
    getInstructors: [User]
    getUserAssessmentProgressInTraining(
      userId: String!
      trainingId: String!
    ): UserAssessmentProgress
  }

  ## Mutations
  type Mutation {
    # User mutations
    updateUser(
      id: String!
      name: String
      phone: String
      area: String
      image: String
    ): User

    updateUsers(users: [UpdateUserInput!]!): [User]


    deleteUser(id: String!): Boolean
    
  }

 

`;
