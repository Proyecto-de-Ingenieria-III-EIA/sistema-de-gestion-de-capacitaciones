import gql from 'graphql-tag';

const userTypes = gql`
  type User {
    id: ID
    name: String
    email: String
    emailVerified: DateTime
    image: String
  }

  type Query {
    getUsers: [User]
    getUserByEmail(email: String): User
  }

  type Mutation {
    updateUser: User
  }
`;

export { userTypes };
