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

  ## Queries
  type Query {
    # Users
    getUsers: [User]
    getUserById(id: String!): User
    getUserByEmail(email: String!): User
    getUserTrainings: [Training]
    
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

    deleteUser(id: String!): Boolean
    
    assignTrainingToUser(userId: String!, trainingId: String!): User
  }

 

`;
