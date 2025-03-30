import gql from "graphql-tag";

const sessionTypes = gql`
  type Session {
    sessionToken: String
    expires: DateTime
    createdAt: DateTime
    updatedAt: DateTime
    user: User
  }

  type Query {
    getSession(sessionToken: String!): Session
  }

  type Mutation {
    createSession(sessionToken: String!, userId: String!, expires: DateTime!): Session
    deleteSession(sessionToken: String!): Boolean
  }
`;

export { sessionTypes };